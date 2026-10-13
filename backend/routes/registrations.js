const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { generateTicketQR } = require('../utils/qrGenerator');

// POST /api/registrations (Register student for an event)
router.post('/', async (req, res) => {
  const { eventId, userId, specialRequirements, paymentId, paymentAmount } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ success: false, message: 'eventId and userId are required' });
  }

  const event = db.getEventById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  if (event.status !== 'approved') {
    return res.status(400).json({ success: false, message: 'Registrations are only open for approved and published events.' });
  }

  // Check registration deadline if specified
  const now = new Date();
  if (event.registrationCloseDate) {
    const closeDate = new Date(event.registrationCloseDate + 'T23:59:59');
    if (now > closeDate) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed for this event.' });
    }
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // 1. Prevent duplicate registrations for same student and event
  const userRegistrations = db.getRegistrationsByUser(userId);
  const existing = userRegistrations.find(r => r.eventId === eventId && r.status !== 'cancelled');
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'You have already registered for this event! View your verified pass in My Tickets.',
      existingTicket: existing
    });
  }

  // 2. Enforce capacity check
  const currentCount = event.registeredCount || 0;
  if (currentCount >= event.capacity) {
    return res.status(400).json({
      success: false,
      message: 'Event is at full capacity! Registration closed.'
    });
  }

  // 3. Paid event validation
  let paymentStatus = 'free';
  let recordedPaymentId = null;
  let finalAmount = 0;

  if (event.isPaid && event.feeAmount > 0) {
    finalAmount = event.feeAmount;
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: `This is a paid event (₹${event.feeAmount}). Verified payment transaction required.`
      });
    }
    paymentStatus = 'paid';
    recordedPaymentId = paymentId;
  }

  // Generate unique IDs
  const regId = `reg_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
  const seatPrefix = String.fromCharCode(65 + Math.floor(currentCount / 30));
  const seatNum = (currentCount % 30) + 1;
  const seatString = `${seatPrefix}-${String(seatNum).padStart(2, '0')}`;

  // Generate non-guessable QR token and high-res SVG/dataURL
  let qrResult;
  try {
    qrResult = await generateTicketQR(eventId, regId, userId);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate cryptographic QR ticket' });
  }

  const newRegistration = {
    id: regId,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventStartTime: event.startTime,
    eventEndTime: event.endTime,
    eventVenue: event.venueName,
    posterUrl: event.posterUrl,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userRegNo: user.studentOrStaffId || user.rollNumber || 'RA2211003020042',
    userDept: user.department || 'Computer Science & Engineering',
    userAvatar: user.avatar,
    qrCodeToken: qrResult.token,
    qrCodeDataUrl: qrResult.qrDataUrl,
    seatNumber: seatString,
    status: 'registered', // 'registered', 'attended', 'cancelled'
    paymentStatus,
    paymentId: recordedPaymentId,
    amountPaid: finalAmount,
    currency: event.currency || 'INR',
    specialRequirements: specialRequirements || '',
    registeredAt: new Date().toISOString(),
    checkedInAt: null,
    checkedInBy: null
  };

  db.createRegistration(newRegistration);

  // Send in-app notification to student
  db.addNotification({
    recipientId: user.id,
    title: `Registration Confirmed: ${event.title}`,
    message: `Your seat (${seatString}) at ${event.venueName} is confirmed. Access your QR pass in My Tickets.`,
    type: 'registration'
  });

  db.addAuditLog({
    action: 'REGISTRATION_CONFIRMED',
    targetType: 'registration',
    targetId: newRegistration.id,
    targetName: event.title,
    performedBy: user.name,
    role: 'student',
    details: `Booked seat ${seatString} (${paymentStatus.toUpperCase()} - ₹${finalAmount})`
  });

  res.status(201).json({
    success: true,
    message: 'Registration confirmed! Your verified QR pass is ready.',
    registration: newRegistration
  });
});

// GET /api/registrations/my?userId=xxx
router.get('/my', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  const list = db.getRegistrationsByUser(userId);
  list.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

  res.json({
    success: true,
    count: list.length,
    registrations: list
  });
});

// GET /api/registrations/event/:eventId (Participant roster with attendance stats)
router.get('/event/:eventId', (req, res) => {
  const { eventId } = req.params;
  const list = db.getRegistrationsByEvent(eventId);
  const event = db.getEventById(eventId);

  const totalRegistered = list.length;
  const totalAttended = list.filter(r => r.status === 'attended').length;
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;
  const totalPaidRevenue = list
    .filter(r => r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + (r.amountPaid || 0), 0);

  res.json({
    success: true,
    event: event ? { id: event.id, title: event.title, date: event.date, capacity: event.capacity } : null,
    stats: {
      totalRegistered,
      totalAttended,
      pendingCheckIn: totalRegistered - totalAttended,
      attendanceRate,
      totalPaidRevenue
    },
    attendees: list
  });
});

// POST /api/registrations/check-in (Staff QR scanner endpoint)
router.post('/check-in', (req, res) => {
  let { token, eventId, staffName } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      status: 'INVALID',
      message: 'No QR ticket token provided'
    });
  }

  // Handle scanned raw JSON payload if camera scanner returns JSON string
  if (typeof token === 'string' && token.startsWith('{') && token.endsWith('}')) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.token) token = parsed.token;
    } catch (e) {}
  }

  // 1. Locate registration by unique token
  const registration = db.getRegistrationByToken(token.trim());

  if (!registration) {
    return res.status(404).json({
      success: false,
      status: 'INVALID',
      message: 'Counterfeit or Unrecognized Ticket! Token not found in university database.'
    });
  }

  // 2. Reject cancelled tickets
  if (registration.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      status: 'CANCELLED',
      message: 'Registration was previously CANCELLED. Access denied.',
      registration
    });
  }

  // 3. Confirm ticket belongs to selected event
  if (eventId && registration.eventId !== eventId) {
    const wrongEvent = db.getEventById(registration.eventId);
    return res.status(400).json({
      success: false,
      status: 'WRONG_EVENT',
      message: `Ticket belongs to a DIFFERENT event: "${wrongEvent ? wrongEvent.title : registration.eventTitle}"!`,
      registration
    });
  }

  // 4. Duplicate Check-in Prevention
  if (registration.status === 'attended') {
    const checkInTime = new Date(registration.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return res.status(409).json({
      success: false,
      status: 'DUPLICATE',
      message: `ALREADY CHECKED IN! Scanned earlier at ${checkInTime} by ${registration.checkedInBy || 'Gate Staff'}. Prevent duplicate entry!`,
      registration
    });
  }

  // 5. Confirm Check-in & Mark Attendance
  const checkInTimeISO = new Date().toISOString();
  const updated = db.updateRegistration(registration.id, {
    status: 'attended',
    checkedInAt: checkInTimeISO,
    checkedInBy: staffName || 'Gate Scanner'
  });

  // Automatically issue a verified Certificate of Attendance!
  const certId = `cert_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
  const certNumber = `SRM-CERT-${new Date().getFullYear()}-${registration.userRegNo?.slice(-4) || 'STD'}-${Math.floor(1000 + Math.random() * 9000)}`;
  const hash = `SHA256:${Math.random().toString(36).substr(2, 10)}${Math.random().toString(36).substr(2, 10)}`;

  const certificate = {
    id: certId,
    certificateNumber: certNumber,
    userId: registration.userId,
    userName: registration.userName,
    userRegNo: registration.userRegNo,
    department: registration.userDept,
    eventTitle: registration.eventTitle,
    eventDate: registration.eventDate,
    organizerClub: 'SRM Directorate of Student Affairs & Club Advisory',
    issuedBy: 'Dean of Student Affairs & Faculty Advisor',
    issuedAt: checkInTimeISO,
    verificationHash: hash,
    grade: 'Merit of Verified Attendance'
  };

  db.addCertificate(certificate);

  // Send Notification to student
  db.addNotification({
    recipientId: registration.userId,
    title: `Attendance Confirmed & Certificate Issued: ${registration.eventTitle}`,
    message: `Your attendance has been recorded at ${registration.eventVenue}. Your certificate (${certNumber}) is now available in My Tickets.`,
    type: 'certificate'
  });

  db.addAuditLog({
    action: 'ATTENDANCE_CHECKIN_VERIFIED',
    targetType: 'attendance',
    targetId: registration.id,
    targetName: registration.eventTitle,
    performedBy: staffName || 'Gate Scanner',
    role: 'staff',
    details: `${registration.userName} (${registration.userRegNo}) entered seat ${registration.seatNumber}`
  });

  res.json({
    success: true,
    status: 'SUCCESS',
    message: `Entry Verified! Welcome, ${registration.userName}. Attendance recorded.`,
    registration: updated,
    certificate
  });
});

// POST /api/registrations/cancel/:id
router.post('/cancel/:id', (req, res) => {
  const reg = db.getRegistrationById(req.params.id);
  if (!reg) {
    return res.status(404).json({ success: false, message: 'Registration not found' });
  }

  const updated = db.updateRegistration(req.params.id, { status: 'cancelled' });

  // Free up seat in event
  const event = db.getEventById(reg.eventId);
  if (event && event.registeredCount > 0) {
    db.updateEvent(event.id, { registeredCount: event.registeredCount - 1 });
  }

  db.addNotification({
    recipientId: reg.userId,
    title: `Registration Cancelled: ${reg.eventTitle}`,
    message: `Your booking for ${reg.eventDate} has been cancelled as requested.`,
    type: 'registration'
  });

  res.json({ success: true, message: 'Registration cancelled successfully', registration: updated });
});

module.exports = router;
