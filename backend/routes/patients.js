const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Get patient profile
router.get('/profile', auth, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ message: 'Access denied' });
  try {
    const patient = await User.findById(req.user.id).select('-password');
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get consultations for patient
router.get('/consultations', auth, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ message: 'Access denied' });
  try {
    const consultations = await Consultation.find({ patient: req.user.id }).populate('doctor', 'name specialty');
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get prescriptions for patient
router.get('/prescriptions', auth, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ message: 'Access denied' });
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id }).populate('doctor consultation');
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;