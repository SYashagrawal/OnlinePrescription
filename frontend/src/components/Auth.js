import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ role }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    specialty: '', experience: '', age: '', surgeryHistory: '', illnessHistory: '',
    profilePicture: null
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data;
    if (isSignUp) {
      data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });
      data.append('role', role);
    } else {
      data = { email: formData.email, password: formData.password, role };
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${isSignUp ? 'signup' : 'signin'}`, data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(role === 'doctor' ? '/doctor/profile' : '/patient/dashboard');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>{isSignUp ? 'Sign Up' : 'Sign In'} as {role}</Typography>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} required />
              <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} required />
              <TextField fullWidth margin="normal" label="Phone" name="phone" onChange={handleChange} required />
              <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />
              <input type="file" name="profilePicture" onChange={handleChange} accept="image/*" />
              {role === 'doctor' && (
                <>
                  <TextField fullWidth margin="normal" label="Specialty" name="specialty" onChange={handleChange} required />
                  <TextField fullWidth margin="normal" label="Years of Experience" name="experience" type="number" step="0.1" onChange={handleChange} required />
                </>
              )}
              {role === 'patient' && (
                <>
                  <TextField fullWidth margin="normal" label="Age" name="age" type="number" onChange={handleChange} required />
                  <TextField fullWidth margin="normal" label="History of Surgery" name="surgeryHistory" onChange={handleChange} />
                  <TextField fullWidth margin="normal" label="History of Illness" name="illnessHistory" onChange={handleChange} />
                </>
              )}
            </>
          )}
          {!isSignUp && (
            <>
              <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} required />
              <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />
            </>
          )}
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
        </form>
        <Button onClick={() => setIsSignUp(!isSignUp)} sx={{ mt: 1 }}>Switch to {isSignUp ? 'Sign In' : 'Sign Up'}</Button>
      </Paper>
    </Box>
  );
};

export default Auth;