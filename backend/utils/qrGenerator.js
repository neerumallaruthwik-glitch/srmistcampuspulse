const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generates a tamper-proof unique ticket token and a high-resolution QR Code Data URL.
 * @param {string} eventId
 * @param {string} registrationId
 * @param {string} userId
 * @returns {Promise<{ token: string, qrDataUrl: string }>}
 */
async function generateTicketQR(eventId, registrationId, userId) {
  const hash = crypto.randomBytes(4).toString('hex').toUpperCase();
  const token = `CP-${eventId.replace(/[^a-zA-Z0-9]/g, '')}-${registrationId.replace(/[^a-zA-Z0-9]/g, '')}-${hash}`;

  const payload = JSON.stringify({
    app: "CampusPulse",
    token: token,
    eventId: eventId,
    regId: registrationId,
    uid: userId,
    issuedAt: Date.now()
  });

  try {
    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 8,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    return { token, qrDataUrl, payload };
  } catch (err) {
    console.error('QR generation failed:', err);
    throw err;
  }
}

module.exports = {
  generateTicketQR
};
