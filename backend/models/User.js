const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['doctor', 'patient'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  // Doctor specific
  specialty: { type: String },
  experience: { type: Number },
  // Patient specific
  age: { type: Number },
  surgeryHistory: { type: String },
  illnessHistory: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);