const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/certificates/my?userId=xxx
router.get('/my', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  const certificates = db.getCertificatesByUser(userId);
  res.json({
    success: true,
    total: certificates.length,
    certificates
  });
});

// GET /api/certificates/:id
router.get('/:id', (req, res) => {
  const cert = db.getCertificateById(req.params.id);
  if (!cert) {
    return res.status(404).json({ success: false, message: 'Certificate not found' });
  }
  res.json({ success: true, certificate: cert });
});

module.exports = router;
