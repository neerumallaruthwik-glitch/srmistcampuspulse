const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { checkVenueConflict } = require('../utils/conflictDetector');

// Calculate personalized recommendation score (0-99%) based on student interests
function calculateRecommendationScore(event, user) {
  if (!user || !user.interests || user.interests.length === 0) return 55;

  let score = 35; // base score

  // Interest match
  const userInterests = user.interests.map(i => i.toLowerCase());
  const eventCategory = (event.category || '').toLowerCase();

  if (userInterests.some(i => eventCategory.includes(i) || i.includes(eventCategory))) {
    score += 40;
  }

  // Tag matches
  const matchedTags = (event.tags || []).filter(tag =>
    userInterests.some(interest => interest.includes(tag.toLowerCase()) || tag.toLowerCase().includes(interest))
  );
  score += Math.min(matchedTags.length * 8, 20);

  // Department alignment bonus
  if (user.department && event.description && event.description.toLowerCase().includes(user.department.toLowerCase().split(' ')[0])) {
    score += 8;
  }

  return Math.min(score, 99);
}

// GET /api/events
router.get('/', (req, res) => {
  const {
    category,
    search,
    venueId,
    date,
    dateFrom,
    dateTo,
    format,
    fee,
    availability,
    sort = 'upcoming',
    status,
    organizerId,
    userId
  } = req.query;

  let events = db.getEvents();

  // Status Filter: defaults to 'approved' for student viewing, or 'all' if explicitly requested
  if (status && status !== 'all') {
    events = events.filter(e => e.status === status);
  } else if (!status) {
    events = events.filter(e => e.status === 'approved');
  }

  // Organizer Filter
  if (organizerId) {
    events = events.filter(e => e.organizerId === organizerId);
  }

  // Category Filter
  if (category && category !== 'All') {
    events = events.filter(e => e.category === category);
  }

  // Format Filter: 'online' vs 'offline'
  if (format && format !== 'all') {
    events = events.filter(e => (e.format || 'offline').toLowerCase() === format.toLowerCase());
  }

  // Fee Filter: 'free' vs 'paid'
  if (fee && fee !== 'all') {
    if (fee === 'free') {
      events = events.filter(e => !e.isPaid || e.feeAmount === 0);
    } else if (fee === 'paid') {
      events = events.filter(e => e.isPaid && e.feeAmount > 0);
    }
  }

  // Venue Filter
  if (venueId && venueId !== 'all') {
    events = events.filter(e => e.venueId === venueId);
  }

  // Exact Date Filter
  if (date) {
    events = events.filter(e => e.date === date);
  }

  // Date Range Filter
  if (dateFrom) {
    events = events.filter(e => e.date >= dateFrom);
  }
  if (dateTo) {
    events = events.filter(e => e.date <= dateTo);
  }

  // Availability Filter
  if (availability && availability !== 'all') {
    if (availability === 'open') {
      events = events.filter(e => (e.registeredCount || 0) < e.capacity);
    } else if (availability === 'sold-out') {
      events = events.filter(e => (e.registeredCount || 0) >= e.capacity);
    }
  }

  // Search keyword across title, description, venue, tags, club, coordinator
  if (search) {
    const q = search.toLowerCase();
    events = events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.venueName.toLowerCase().includes(q) ||
      (e.clubName && e.clubName.toLowerCase().includes(q)) ||
      (e.facultyCoordinator && e.facultyCoordinator.toLowerCase().includes(q)) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Enrich with calculated seats & recommendation scores
  const user = userId ? db.getUserById(userId) : null;
  let enriched = events.map(e => ({
    ...e,
    recommendationScore: calculateRecommendationScore(e, user),
    availableSeats: Math.max((e.capacity || 0) - (e.registeredCount || 0), 0),
    isSoldOut: (e.registeredCount || 0) >= e.capacity
  }));

  // Sorting
  if (sort === 'popularity') {
    enriched.sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0));
  } else if (sort === 'newest') {
    enriched.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
  } else if (sort === 'recommended') {
    enriched.sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));
  } else {
    // default: upcoming by event date
    enriched.sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));
  }

  res.json({
    success: true,
    total: enriched.length,
    events: enriched
  });
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const venue = db.getVenueById(event.venueId);
  const registrations = db.getRegistrationsByEvent(event.id);
  const checkedInCount = registrations.filter(r => r.status === 'attended').length;

  res.json({
    success: true,
    event: {
      ...event,
      venueDetails: venue,
      availableSeats: Math.max((event.capacity || 0) - (event.registeredCount || 0), 0),
      isSoldOut: (event.registeredCount || 0) >= event.capacity,
      actualAttendanceCount: checkedInCount,
      attendanceRate: event.registeredCount > 0 ? Math.round((checkedInCount / event.registeredCount) * 100) : 0
    }
  });
});

// POST /api/events (Create new event proposal)
router.post('/', (req, res) => {
  const {
    title,
    category,
    format = 'offline',
    description,
    posterUrl,
    venueId,
    date,
    startTime,
    endTime,
    capacity,
    isPaid = false,
    feeAmount = 0,
    currency = 'INR',
    organizerId,
    facultyCoordinator,
    clubName,
    tags,
    rules,
    eligibility,
    prerequisites,
    contactEmail,
    contactPhone,
    cancellationPolicy,
    resources,
    registrationCloseDate,
    status = 'pending'
  } = req.body;

  if (!title || !category || !venueId || !date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Title, category, target venue, date, start time, and end time are required.'
    });
  }

  const venue = db.getVenueById(venueId);
  const organizer = db.getUserById(organizerId) || { name: 'Campus Organizer', club: 'SRM Student Council' };

  // Run venue conflict detection
  const conflictReport = checkVenueConflict({
    venueId,
    date,
    startTime,
    endTime
  });

  const newEvent = {
    id: `evt_${Date.now()}`,
    title,
    category,
    format: format || 'offline',
    description: description || 'Comprehensive overview of proposed campus event.',
    posterUrl: posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    venueId,
    venueName: venue ? venue.name : 'Target Campus Venue',
    date,
    startTime,
    endTime,
    capacity: Number(capacity) || (venue ? venue.capacity : 100),
    registeredCount: 0,
    isPaid: Boolean(isPaid),
    feeAmount: Number(feeAmount) || 0,
    currency: currency || 'INR',
    status: status, // 'draft' or 'pending'
    organizerId: organizerId || 'usr_organizer_1',
    organizerName: organizer.name,
    facultyCoordinator: facultyCoordinator || organizer.title || 'Faculty Advisory Committee',
    clubId: organizer.clubId || 'club_1',
    clubName: clubName || organizer.club || 'SRM Student Council',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
    rules: Array.isArray(rules) ? rules : ['College ID card mandatory', 'Discipline and academic decorum required'],
    eligibility: eligibility || 'Open to all enrolled undergraduate and postgraduate students.',
    prerequisites: prerequisites || 'None specified.',
    contactEmail: contactEmail || organizer.email || 'events@srmist.edu.in',
    contactPhone: contactPhone || organizer.phone || '+91 44 2249 2882',
    cancellationPolicy: cancellationPolicy || 'Free cancellation available up to 24 hours prior to commencement.',
    resources: Array.isArray(resources) ? resources : [],
    registrationOpenDate: new Date().toISOString().split('T')[0],
    registrationCloseDate: registrationCloseDate || date,
    hasConflictWarning: conflictReport.hasConflict,
    conflictDetails: conflictReport.hasConflict ? conflictReport.conflicts : null,
    approvalHistory: [
      {
        status: status === 'draft' ? 'draft_created' : 'submitted',
        timestamp: new Date().toISOString(),
        adminName: organizer.name,
        notes: conflictReport.hasConflict
          ? 'Submitted with scheduling overlap alert.'
          : 'Proposal submitted for Dean review.'
      }
    ]
  };

  db.createEvent(newEvent);

  db.addAuditLog({
    action: 'EVENT_CREATED',
    targetType: 'event',
    targetId: newEvent.id,
    targetName: newEvent.title,
    performedBy: organizer.name,
    role: organizer.role || 'organizer',
    details: `Created proposal for ${newEvent.venueName} on ${newEvent.date}`
  });

  // Notify Admin of new event awaiting clearance
  db.addNotification({
    recipientId: 'usr_admin_1',
    title: `New Proposal Awaiting Approval: ${newEvent.title}`,
    message: `${organizer.name} submitted an event request for ${newEvent.venueName} on ${newEvent.date}.`,
    type: 'approval'
  });

  res.status(201).json({
    success: true,
    event: newEvent,
    conflictReport
  });
});

// PUT /api/events/:id
router.put('/:id', (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const updates = { ...req.body };

  if (updates.venueId) {
    const venue = db.getVenueById(updates.venueId);
    if (venue) updates.venueName = venue.name;
  }

  const updated = db.updateEvent(req.params.id, updates);
  res.json({ success: true, event: updated });
});

// POST /api/events/:id/submit-approval
router.post('/:id/submit-approval', (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const conflictReport = checkVenueConflict({
    venueId: event.venueId,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    excludeEventId: event.id
  });

  const updatedHistory = [...(event.approvalHistory || []), {
    status: 'submitted',
    timestamp: new Date().toISOString(),
    adminName: event.organizerName || 'Organizer',
    notes: 'Submitted for Dean of Student Affairs review.'
  }];

  const updated = db.updateEvent(req.params.id, {
    status: 'pending',
    hasConflictWarning: conflictReport.hasConflict,
    conflictDetails: conflictReport.hasConflict ? conflictReport.conflicts : null,
    approvalHistory: updatedHistory
  });

  // Notify admin
  db.addNotification({
    recipientId: 'usr_admin_1',
    title: `Proposal Resubmitted: ${event.title}`,
    message: `Resubmitted for review at ${event.venueName}.`,
    type: 'approval'
  });

  res.json({
    success: true,
    message: 'Event proposal submitted for administration approval',
    event: updated,
    conflictReport
  });
});

// DELETE /api/events/:id
router.delete('/:id', (req, res) => {
  const success = db.deleteEvent(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.json({ success: true, message: 'Event deleted successfully' });
});

module.exports = router;
