const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { checkVenueConflict } = require('../utils/conflictDetector');

// GET /api/admin/pending (List pending event approval requests)
router.get('/pending', (req, res) => {
  const events = db.getEvents();
  const pending = events.filter(e => e.status === 'pending');

  // Enrich each pending event with a real-time conflict verification check
  const enriched = pending.map(e => {
    const conflictCheck = checkVenueConflict({
      venueId: e.venueId,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      excludeEventId: e.id
    });
    return {
      ...e,
      realtimeConflictStatus: conflictCheck
    };
  });

  res.json({
    success: true,
    count: enriched.length,
    pendingEvents: enriched
  });
});

// POST /api/admin/approve/:id
router.post('/approve/:id', (req, res) => {
  const { adminName, notes } = req.body;
  const event = db.getEventById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const approvalRecord = {
    status: 'approved',
    timestamp: new Date().toISOString(),
    adminName: adminName || 'Campus Administration',
    notes: notes || 'Event approved. Facilities and permissions granted.'
  };

  const updatedHistory = [...(event.approvalHistory || []), approvalRecord];

  const updated = db.updateEvent(req.params.id, {
    status: 'approved',
    rejectionReason: null,
    approvalHistory: updatedHistory
  });

  db.addAuditLog({
    action: 'EVENT_APPROVED',
    targetType: 'event',
    targetId: event.id,
    targetName: event.title,
    performedBy: adminName || 'Campus Administrator',
    role: 'admin',
    details: notes || 'Event request approved.'
  });

  res.json({
    success: true,
    message: `Event "${event.title}" has been approved!`,
    event: updated
  });
});

// POST /api/admin/reject/:id
router.post('/reject/:id', (req, res) => {
  const { adminName, reason, notes } = req.body;
  const event = db.getEventById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const rejectionRecord = {
    status: 'rejected',
    timestamp: new Date().toISOString(),
    adminName: adminName || 'Campus Administration',
    reason: reason || 'Schedule/venue constraints',
    notes: notes || 'Please reschedule or choose an alternative venue.'
  };

  const updatedHistory = [...(event.approvalHistory || []), rejectionRecord];

  const updated = db.updateEvent(req.params.id, {
    status: 'rejected',
    rejectionReason: reason || notes || 'Request declined by administration',
    approvalHistory: updatedHistory
  });

  db.addAuditLog({
    action: 'EVENT_REJECTED',
    targetType: 'event',
    targetId: event.id,
    targetName: event.title,
    performedBy: adminName || 'Campus Administrator',
    role: 'admin',
    details: `Rejected. Reason: ${reason || notes}`
  });

  res.json({
    success: true,
    message: `Event "${event.title}" has been rejected.`,
    event: updated
  });
});

// GET /api/admin/history
router.get('/history', (req, res) => {
  const auditLogs = db.getAuditLogs();
  const allEvents = db.getEvents();

  // Combine approval history records from events
  const approvalEvents = [];
  allEvents.forEach(e => {
    if (e.approvalHistory && e.approvalHistory.length > 0) {
      e.approvalHistory.forEach(h => {
        approvalEvents.push({
          eventId: e.id,
          eventTitle: e.title,
          venueName: e.venueName,
          date: e.date,
          status: h.status,
          timestamp: h.timestamp,
          adminName: h.adminName,
          notes: h.notes,
          reason: h.reason
        });
      });
    }
  });

  // Sort descending by timestamp
  approvalEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    success: true,
    approvalHistory: approvalEvents,
    auditLogs: auditLogs
  });
});

// POST /api/admin/reset (Demo helper)
router.post('/reset', (req, res) => {
  db.reset();
  res.json({ success: true, message: 'Database reset to initial demo seeds successfully!' });
});

module.exports = router;
