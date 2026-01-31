import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Doctors</Typography>
      <Button variant="outlined" onClick={() => navigate('/patient/prescriptions')} sx={{ mb: 2 }}>View My Prescriptions</Button>
      <Grid container spacing={2}>
        {doctors.map(doctor => (
          <Grid item xs={12} sm={6} md={4} key={doctor._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={doctor.profilePicture ? `http://localhost:5000/uploads/${doctor.profilePicture}` : '/default-avatar.png'}
                alt={doctor.name}
              />
              <CardContent>
                <Typography variant="h6">{doctor.name}</Typography>
                <Typography variant="body2">{doctor.specialty}</Typography>
                <Button variant="contained" onClick={() => navigate(`/consultation/${doctor._id}`)}>Consult</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PatientDashboard;