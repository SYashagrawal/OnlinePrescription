import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Stepper, Step, StepLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const steps = ['Current Illness', 'Family History', 'Payment'];

const ConsultationForm = () => {
  const { doctorId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    currentIllness: '', recentSurgery: '', surgeryTimeSpan: '',
    diabetics: 'Non-Diabetics', allergies: '', others: '',
    paymentTransactionId: ''
  });
  const [qrCode, setQrCode] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      // Generate QR
      const qrData = `Payment for consultation with doctor ${doctorId}`;
      try {
        const QRCode = await import('qrcode');
        const qrCode = await QRCode.default.toDataURL(qrData);
        setQrCode(qrCode);
      } catch (err) {
        console.error(err);
      }
      setActiveStep(activeStep + 1);
    } else if (activeStep === 2) {
      // Submit
      try {
        const token = localStorage.getItem('token');
        await axios.post('https://onlineprescription.onrender.com/api/consultations', {
          doctorId,
          currentIllness: formData.currentIllness,
          recentSurgery: formData.recentSurgery,
          surgeryTimeSpan: formData.surgeryTimeSpan,
          familyHistory: {
            diabetics: formData.diabetics,
            allergies: formData.allergies,
            others: formData.others
          },
          paymentTransactionId: formData.paymentTransactionId
        }, { headers: { Authorization: `Bearer ${token}` } });
        alert('Consultation submitted');
        navigate('/patient/dashboard');
      } catch (err) {
        alert(err.response.data.message);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField fullWidth margin="normal" label="Current Illness History" name="currentIllness" multiline rows={4} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Recent Surgery" name="recentSurgery" onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Surgery Time Span" name="surgeryTimeSpan" onChange={handleChange} />
          </>
        );
      case 1:
        return (
          <>
            <Typography>Diabetics or Non-Diabetics</Typography>
            <RadioGroup name="diabetics" value={formData.diabetics} onChange={handleChange}>
              <FormControlLabel value="Diabetics" control={<Radio />} label="Diabetics" />
              <FormControlLabel value="Non-Diabetics" control={<Radio />} label="Non-Diabetics" />
            </RadioGroup>
            <TextField fullWidth margin="normal" label="Any Allergies" name="allergies" onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Others" name="others" onChange={handleChange} />
          </>
        );
      case 2:
        return (
          <>
            {qrCode && <img src={qrCode} alt="QR Code" />}
            <TextField fullWidth margin="normal" label="Transaction ID" name="paymentTransactionId" onChange={handleChange} required />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Paper sx={{ p: 4, mt: 2 }}>
        {renderStepContent(activeStep)}
        <Box sx={{ mt: 2 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          <Button variant="contained" onClick={handleNext}>{activeStep === steps.length - 1 ? 'Submit' : 'Next'}</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConsultationForm;