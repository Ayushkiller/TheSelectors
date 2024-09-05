import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Briefcase, Book } from 'lucide-react';

const CreateInterview = () => {
  const [form, setForm] = useState({
    subject: '',
    date: '',
    candidateName: '',
    requiredExpertise: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_PORT}/api/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data._id) {
        setSnackbar({ open: true, message: 'Interview created successfully!' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message || 'Failed to create interview');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Interview
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <Book size={20} style={{ marginRight: 8 }} />,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: <Calendar size={20} style={{ marginRight: 8 }} />,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Candidate Name"
            name="candidateName"
            value={form.candidateName}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <User size={20} style={{ marginRight: 8 }} />,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Required Expertise"
            name="requiredExpertise"
            value={form.requiredExpertise}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <Briefcase size={20} style={{ marginRight: 8 }} />,
            }}
          />
          <Button 
            type="submit" 
            fullWidth
            variant="contained" 
            color="primary" 
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Interview'}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        message={snackbar.message}
      />
    </Container>
  );
};

export default CreateInterview;
