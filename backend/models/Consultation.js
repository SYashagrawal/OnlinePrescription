const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentIllness: { type: String, required: true },
  recentSurgery: { type: String },
  surgeryTimeSpan: { type: String },
  familyHistory: {
    diabetics: { type: String, enum: ['Diabetics', 'Non-Diabetics'], required: true },
    allergies: { type: String },
    others: { type: String },
  },
  paymentTransactionId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);