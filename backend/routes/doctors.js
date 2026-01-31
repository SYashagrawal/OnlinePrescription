const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor profile
router.get('/profile', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });
  try {
    const doctor = await User.findById(req.user.id).select('-password');
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create consultation
router.post('/consultation', auth, async (req, res) => {
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

// Get consultations for doctor
router.get('/consultations', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });
  try {
    const consultations = await Consultation.find({ doctor: req.user.id }).populate('patient', 'name email');
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate QR code for payment
router.get('/payment-qr/:consultationId', auth, async (req, res) => {
  try {
    const qrData = `Payment for consultation ${req.params.consultationId}`;
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create prescription
router.post('/prescription', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });
  const { consultationId, careToBeTaken, medicines } = req.body;

  try {
    const consultation = await Consultation.findById(consultationId).populate('patient doctor');
    if (!consultation || consultation.doctor._id.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    // Generate PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, '../uploads/pdfs', `prescription_${consultationId}.pdf`);
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(25).text('Prescription', 100, 100);
    doc.fontSize(12).text(`Doctor: ${consultation.doctor.name}`, 100, 150);
    doc.text(`Patient: ${consultation.patient.name}`, 100, 170);
    doc.text(`Care to be taken: ${careToBeTaken}`, 100, 190);
    doc.text(`Medicines: ${medicines}`, 100, 210);
    doc.end();

    const prescription = new Prescription({
      consultation: consultationId,
      doctor: req.user.id,
      patient: consultation.patient._id,
      careToBeTaken,
      medicines,
      pdfPath: `uploads/pdfs/prescription_${consultationId}.pdf`,
    });
    await prescription.save();

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get prescriptions for doctor
router.get('/prescriptions', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });
  try {
    const prescriptions = await Prescription.find({ doctor: req.user.id }).populate('consultation patient');
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send prescription (simulate)
router.post('/send-prescription/:id', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription || prescription.doctor.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    prescription.sent = true;
    await prescription.save();
    res.json({ message: 'Prescription sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;