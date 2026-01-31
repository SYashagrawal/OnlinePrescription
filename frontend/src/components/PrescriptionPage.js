import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PrescriptionPage = () => {
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctors/consultations', { headers: { Authorization: `Bearer ${token}` } });
        setConsultations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConsultations();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Consultations</Typography>
      <List>
        {consultations.map(consultation => (
          <ListItem key={consultation._id}>
            <ListItemText primary={`Patient: ${consultation.patient.name}`} secondary={`Illness: ${consultation.currentIllness}`} />
            <Button variant="contained" onClick={() => navigate(`/prescription/${consultation._id}`)}>Write Prescription</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PrescriptionPage;