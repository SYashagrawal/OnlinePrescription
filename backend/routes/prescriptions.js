const express = require('express');
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Create prescription (for doctors)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });
  const { consultationId, careToBeTaken, medicines } = req.body;

  try {
    const consultation = await Consultation.findById(consultationId).populate('patient doctor');
    if (!consultation || consultation.doctor._id.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    // Generate PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, '../uploads/pdfs', `prescription_${consultationId}.pdf`);
    if (!fs.existsSync(path.dirname(pdfPath))) fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Header
    doc.fontSize(20).text('Online Prescription Platform', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Prescription', { align: 'center' });
    doc.moveDown(2);

    // Doctor Details
    doc.fontSize(12).text(`Doctor: ${consultation.doctor.name}`, 50, doc.y);
    doc.text(`Specialty: ${consultation.doctor.specialty}`, 50, doc.y);
    doc.text(`Email: ${consultation.doctor.email}`, 50, doc.y);
    doc.text(`Phone: ${consultation.doctor.phone}`, 50, doc.y);
    doc.moveDown();

    // Patient Details
    doc.text(`Patient: ${consultation.patient.name}`, 300, doc.y - 80);
    doc.text(`Email: ${consultation.patient.email}`, 300, doc.y);
    doc.text(`Phone: ${consultation.patient.phone}`, 300, doc.y);
    doc.moveDown(2);

    // Date
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, doc.y);
    doc.moveDown();

    // Rx Symbol
    doc.fontSize(24).text('Rx', 50, doc.y);
    doc.moveDown();

    // Medicines
    doc.fontSize(12).text('Medicines:', 50, doc.y);
    doc.moveDown(0.5);
    const medicinesList = medicines.split('\n');
    medicinesList.forEach(med => {
      doc.text(`- ${med}`, 70, doc.y);
      doc.moveDown(0.5);
    });
    doc.moveDown();

    // Care to be taken
    doc.text('Care to be taken:', 50, doc.y);
    doc.moveDown(0.5);
    const careList = careToBeTaken.split('\n');
    careList.forEach(care => {
      doc.text(`- ${care}`, 70, doc.y);
      doc.moveDown(0.5);
    });
    doc.moveDown(2);

    // Signature
    doc.text('Doctor\'s Signature: ___________________________', 50, doc.y);
    doc.moveDown();
    doc.text(consultation.doctor.name, 200, doc.y);

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

// Update prescription
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });
  const { careToBeTaken, medicines } = req.body;

  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription || prescription.doctor.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    prescription.careToBeTaken = careToBeTaken;
    prescription.medicines = medicines;
    await prescription.save();

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send prescription
router.post('/send/:id', auth, async (req, res) => {
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