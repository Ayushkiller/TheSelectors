import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, CircularProgress, List, ListItem, ListItemText, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Briefcase, Book, MessageSquare } from 'lucide-react';

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

  // New state variables for chatbot
  const [chatbotActive, setChatbotActive] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [expertiseEvaluation, setExpertiseEvaluation] = useState(null);
  const [chatbotError, setChatbotError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Include expertiseEvaluation in the form data
      const formData = { ...form, requiredExpertise: expertiseEvaluation ? expertiseEvaluation.expertise : form.requiredExpertise };

      const response = await fetch(`http://${process.env.REACT_APP_API_PORT}/api/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
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

  const startChatbot = () => {
    setChatbotActive(true);
    setChatHistory([{ role: 'assistant', content: "Hello! I'm here to help evaluate the expertise needed for this role. Let's start with the basics. What is the main role or position you're hiring for?" }]);
    setChatbotError(null);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
  
    const newChatHistory = [...chatHistory, { role: 'user', content: userInput }];
    setChatHistory(newChatHistory);
    setUserInput('');
  
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
      const response = await fetch('http://192.168.3.13:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newChatHistory,
          model: 'phi-3-medium-128k'
        }),
        signal: controller.signal
      });
  
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        if (response.status === 504) {
          throw new Error('Response generation timed out');
        }
        throw new Error('Failed to get response from chatbot');
      }
  
      const data = await response.json();
      setChatHistory([...newChatHistory, { role: 'assistant', content: data.response }]);
  
      if (data.evaluation) {
        setExpertiseEvaluation(data.evaluation);
        setChatbotActive(false);
      }
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      setChatbotError('Failed to get a response from the chatbot. It might be taking too long to generate a response. Please try again or enter the required expertise manually.');
      setChatHistory([...newChatHistory, { role: 'assistant', content: "I'm sorry, I encountered an error or timed out. Please try again or enter the required expertise manually." }]);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Interview
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
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
          {!chatbotActive && !expertiseEvaluation && (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<MessageSquare />}
              onClick={startChatbot}
              sx={{ mt: 2 }}
            >
              Evaluate Required Expertise
            </Button>
          )}
          {chatbotActive && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <List>
                {chatHistory.map((msg, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={msg.role === 'assistant' ? 'Chatbot' : 'You'}
                      secondary={msg.content}
                    />
                  </ListItem>
                ))}
              </List>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={sendMessage}
                sx={{ mt: 1 }}
              >
                Send
              </Button>
            </Box>
          )}
          {chatbotError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {chatbotError}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Required Expertise"
            name="requiredExpertise"
            value={expertiseEvaluation ? expertiseEvaluation.expertise : form.requiredExpertise}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <Briefcase size={20} style={{ marginRight: 8 }} />,
            }}
          />
          {expertiseEvaluation && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Skill Level: {expertiseEvaluation.skillLevel}/10
            </Typography>
          )}
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