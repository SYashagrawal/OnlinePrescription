import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h3" gutterBottom>Online Prescription Platform</Typography>
        <Typography variant="h6" gutterBottom>Choose your role to get started</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/doctor/auth')} sx={{ m: 2 }}>
          Doctor Sign In/Up
        </Button>
        <Button variant="contained" size="large" onClick={() => navigate('/patient/auth')} sx={{ m: 2 }}>
          Patient Sign In/Up
        </Button>
      </Box>
    </Container>
  );
};

export default Home;