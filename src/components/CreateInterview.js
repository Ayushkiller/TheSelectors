import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, CircularProgress, Grid, Chip, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';

const CreateInterview = () => {
  const [form, setForm] = useState({
    subject: '',
    date: '',
    candidateName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', content: "Hello! I'm here to help evaluate the expertise needed for the role you're hiring for. What specific skills or technologies are you looking for?" }]);
  const [userInput, setUserInput] = useState('');
  const [expertiseEvaluation, setExpertiseEvaluation] = useState({});

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');

    try {
      const formData = { 
        ...form, 
        requiredExpertise: JSON.stringify(expertiseEvaluation)
      };

      const response = await fetch('http://192.168.3.13:8000/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
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

  const handleChat = async () => {
    if (!userInput.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', content: userInput }]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('http://192.168.3.13:8000/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          role: 'user', 
          content: userInput
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory([...chatHistory, { role: 'user', content: userInput }, { role: 'assistant', content: data.response }]);

        if (data.extracted_data) {
          setExpertiseEvaluation(data.extracted_data);
        }
      } else {
        setError('Failed to get response from server');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!form.subject || !form.date || !form.candidateName) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  return (
    <Container>
      <Paper sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h4" gutterBottom>Create Interview</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Candidate Name"
            name="candidateName"
            value={form.candidateName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <Box sx={{ margin: '20px 0' }}>
            <Typography variant="h6">Chat with AI</Typography>
            <Box sx={{ height: 400, overflowY: 'scroll', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              {chatHistory.map((msg, index) => (
                <Box key={index} sx={{ marginBottom: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  <Typography variant="body1" sx={{ 
                    backgroundColor: msg.role === 'user' ? '#e1f5fe' : '#f1f8e9', 
                    padding: 1, 
                    borderRadius: 2,
                    display: 'inline-block',
                    maxWidth: '80%'
                  }}>
                    {msg.content}
                  </Typography>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>
            <Box sx={{ display: 'flex', marginTop: 2 }}>
              <TextField
                label="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                fullWidth
                margin="normal"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChat()}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleChat} 
                sx={{ marginLeft: 1, alignSelf: 'center' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <Send />}
              </Button>
            </Box>
          </Box>

          <Box sx={{ margin: '20px 0' }}>
            <Typography variant="h6">Expertise Evaluation</Typography>
            <Grid container spacing={1}>
              {Object.entries(expertiseEvaluation).map(([skill, rating], index) => (
                <Grid item key={index}>
                  <Chip 
                    label={`${skill}: ${rating}`} 
                    color="primary" 
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Interview'}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity="success">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateInterview;
