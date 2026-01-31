const express = require('express');
const auth = require('../middleware/auth');
const Consultation = require('../models/Consultation');
const QRCode = require('qrcode');

const router = express.Router();

// Create consultation (for patients)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ message: 'Access denied' });
  const { doctorId, currentIllness, recentSurgery, surgeryTimeSpan, familyHistory, paymentTransactionId } = req.body;

  try {
    const consultation = new Consultation({
      patient: req.user.id,
      doctor: doctorId,
      currentIllness,
      recentSurgery,
      surgeryTimeSpan,
      familyHistory,
      paymentTransactionId,
    });
    await consultation.save();
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get QR for payment
router.get('/payment-qr/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation || consultation.patient.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    const qrData = `Payment for consultation ${req.params.id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;