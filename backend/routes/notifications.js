const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/notifications/my?userId=xxx
router.get('/my', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  const list = db.getNotificationsByUser(userId);
  const unreadCount = list.filter(n => !n.read).length;

  res.json({
    success: true,
    total: list.length,
    unreadCount,
    notifications: list
  });
});

// POST /api/notifications/mark-read/:id
router.post('/mark-read/:id', (req, res) => {
  const notif = db.markNotificationRead(req.params.id);
  res.json({ success: true, notification: notif });
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }
  db.markAllNotificationsRead(userId);
  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = router;
