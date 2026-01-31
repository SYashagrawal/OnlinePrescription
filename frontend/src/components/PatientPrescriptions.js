import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';
import axios from 'axios';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://onlineprescription.onrender.com/api/patients/prescriptions', { headers: { Authorization: `Bearer ${token}` } });
        setPrescriptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>My Prescriptions</Typography>
      <List>
        {prescriptions.map(prescription => (
          <ListItem key={prescription._id}>
            <ListItemText
              primary={`Doctor: ${prescription.doctor.name}`}
              secondary={`Medicines: ${prescription.medicines} | Care: ${prescription.careToBeTaken}`}
            />
            {prescription.pdfPath && (
              <a href={`https://onlineprescription.onrender.com/${prescription.pdfPath}`} target="_blank">Download PDF</a>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PatientPrescriptions;