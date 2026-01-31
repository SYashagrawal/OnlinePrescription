const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Consultation = require('./models/Consultation');
const Prescription = require('./models/Prescription');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Consultation.deleteMany({});
    await Prescription.deleteMany({});

    // Create doctor
    const doctorSalt = await bcrypt.genSalt(10);
    const doctorPassword = await bcrypt.hash('password123', doctorSalt);
    const doctor = new User({
      role: 'doctor',
      name: 'Dr. John Smith',
      email: 'doctor@example.com',
      phone: '1234567890',
      password: doctorPassword,
      specialty: 'Cardiology',
      experience: 10.5,
      profilePicture: null
    });
    await doctor.save();
    console.log('Doctor created');

    // Create patient
    const patientSalt = await bcrypt.genSalt(10);
    const patientPassword = await bcrypt.hash('password123', patientSalt);
    const patient = new User({
      role: 'patient',
      name: 'Jane Doe',
      email: 'patient@example.com',
      phone: '0987654321',
      password: patientPassword,
      age: 30,
      surgeryHistory: 'Appendectomy in 2020',
      illnessHistory: 'Hypertension, Diabetes',
      profilePicture: null
    });
    await patient.save();
    console.log('Patient created');

    // Create consultation
    const consultation = new Consultation({
      patient: patient._id,
      doctor: doctor._id,
      currentIllness: 'Chest pain and shortness of breath',
      recentSurgery: 'None',
      surgeryTimeSpan: '',
      familyHistory: {
        diabetics: 'Diabetics',
        allergies: 'Penicillin',
        others: 'Heart disease in family'
      },
      paymentTransactionId: 'TXN123456',
      status: 'pending'
    });
    await consultation.save();
    console.log('Consultation created');

    // Create prescription
    const prescription = new Prescription({
      consultation: consultation._id,
      doctor: doctor._id,
      patient: patient._id,
      careToBeTaken: 'Rest for 2 weeks, avoid strenuous activities',
      medicines: 'Aspirin 75mg daily, Metformin 500mg twice daily',
      pdfPath: null, // Will be generated when accessed
      sent: false
    });
    await prescription.save();
    console.log('Prescription created');

    console.log('Seeding completed');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();