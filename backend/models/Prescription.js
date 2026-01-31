const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  careToBeTaken: { type: String, required: true },
  medicines: { type: String, required: true },
  pdfPath: { type: String },
  sent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);