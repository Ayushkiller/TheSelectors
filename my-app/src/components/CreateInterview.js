import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateInterview = () => {
  const [form, setForm] = useState({ subject: '', date: '', candidateName: '', requiredExpertise: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/interviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data._id) {
          navigate('/');
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('Failed to create interview'));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create Interview</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Candidate Name"
          name="candidateName"
          value={form.candidateName}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Required Expertise"
          name="requiredExpertise"
          value={form.requiredExpertise}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Create
        </Button>
      </form>
    </Container>
  );
};

export default CreateInterview;
