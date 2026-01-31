import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PrescriptionForm = () => {
  const { consultationId } = useParams();
  const [formData, setFormData] = useState({ careToBeTaken: '', medicines: '' });
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctors/prescriptions', { headers: { Authorization: `Bearer ${token}` } });
        const presc = res.data.find(p => p.consultation._id === consultationId);
        if (presc) {
          setPrescription(presc);
          setFormData({ careToBeTaken: presc.careToBeTaken, medicines: presc.medicines });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrescription();
  }, [consultationId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://onlineprescription.onrender.com/api/prescriptions', {
        consultationId,
        ...formData
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPrescription(res.data);
      alert('Prescription saved');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleSend = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/prescriptions/send/${prescription._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Prescription sent');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Prescription</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Care to be taken" name="careToBeTaken" multiline rows={4} value={formData.careToBeTaken} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Medicines" name="medicines" multiline rows={4} value={formData.medicines} onChange={handleChange} required />
        <Button variant="contained" type="submit">Save Prescription</Button>
      </form>
      {prescription && (
        <Box sx={{ mt: 2 }}>
          <Typography>PDF: <a href={`https://onlineprescription.onrender.com/${prescription.pdfPath}`} target="_blank">Download</a></Typography>
          <Button variant="outlined" onClick={handleSend}>Send to Patient</Button>
        </Box>
      )}
    </Box>
  );
};

export default PrescriptionForm;