import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home';
import Auth from './components/Auth';
import PatientDashboard from './components/PatientDashboard';
import PatientPrescriptions from './components/PatientPrescriptions';
import DoctorProfile from './components/DoctorProfile';
import ConsultationForm from './components/ConsultationForm';
import PrescriptionPage from './components/PrescriptionPage';
import PrescriptionForm from './components/PrescriptionForm';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor/auth" element={<Auth role="doctor" />} />
          <Route path="/patient/auth" element={<Auth role="patient" />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/consultation/:doctorId" element={<ConsultationForm />} />
          <Route path="/doctor/prescriptions" element={<PrescriptionPage />} />
          <Route path="/prescription/:consultationId" element={<PrescriptionForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;