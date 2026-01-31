import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setDoctor(user);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">{doctor.name}</Typography>
          <Typography>Specialty: {doctor.specialty}</Typography>
          <Typography>Experience: {doctor.experience} years</Typography>
          <Typography>Email: {doctor.email}</Typography>
          <Typography>Phone: {doctor.phone}</Typography>
          <Button variant="contained" onClick={() => navigate('/doctor/prescriptions')}>Go to Prescriptions</Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorProfile;