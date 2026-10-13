const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { checkVenueConflict } = require('../utils/conflictDetector');

// GET /api/conflicts/venues
router.get('/venues', (req, res) => {
  const venues = db.getVenues();
  res.json({ success: true, venues });
});

// POST /api/conflicts/check
router.post('/check', (req, res) => {
  const { venueId, date, startTime, endTime, excludeEventId } = req.body;

  if (!venueId || !date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'venueId, date, startTime, and endTime are required for conflict detection'
    });
  }

  const result = checkVenueConflict({
    venueId,
    date,
    startTime,
    endTime,
    excludeEventId
  });

  res.json({
    success: true,
    ...result
  });
});

module.exports = router;
