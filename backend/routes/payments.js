const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../data/db');

// POST /api/payments/create-order
router.post('/create-order', (req, res) => {
  const { eventId, userId, amount } = req.body;

  if (!eventId || !userId || !amount) {
    return res.status(400).json({ success: false, message: 'eventId, userId, and amount are required' });
  }

  const event = db.getEventById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const orderId = `ORDER_SRM_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    orderId,
    amount,
    currency: event.currency || 'INR',
    eventTitle: event.title,
    keyId: 'rzp_test_srm_campuspulse_sandbox',
    notes: {
      campus: 'SRM Institute of Science and Technology, Ramapuram',
      eventId: event.id
    }
  });
});

// POST /api/payments/verify
router.post('/verify', (req, res) => {
  const { orderId, paymentId, eventId, userId, amount } = req.body;

  if (!orderId || !paymentId) {
    return res.status(400).json({ success: false, message: 'orderId and paymentId are required' });
  }

  // Server-side payment validation simulation (test sandbox verified)
  const isVerified = paymentId.startsWith('TXN_') || paymentId.startsWith('pay_');

  if (!isVerified) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature or transaction failed.' });
  }

  db.addAuditLog({
    action: 'PAYMENT_VERIFIED',
    targetType: 'payment',
    targetId: paymentId,
    targetName: orderId,
    performedBy: userId,
    role: 'student',
    details: `Payment of ₹${amount} confirmed for ${orderId}`
  });

  res.json({
    success: true,
    verified: true,
    transactionReference: paymentId,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
