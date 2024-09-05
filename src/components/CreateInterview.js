import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, CircularProgress, List, ListItem, ListItemText, Alert, Chip, Rating, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Briefcase, Book, PlusCircle, Send } from 'lucide-react';

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

  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', content: "Hello! I'm here to help evaluate the expertise needed for this role. What is the main role or position you're hiring for?" }]);
  const [userInput, setUserInput] = useState('');
  const [expertiseEvaluation] = useState(null);
  const [manualExpertise, setManualExpertise] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', rating: 5 });

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = { 
        ...form, 
        requiredExpertise: JSON.stringify({
          skills: [...(expertiseEvaluation?.skills || []), ...manualExpertise],
          overall_rating: calculateOverallRating([...(expertiseEvaluation?.skills || []), ...manualExpertise])
        })
      };

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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
  
    const newChatHistory = [...chatHistory, { role: 'user', content: userInput }];
    setChatHistory(newChatHistory);
    setUserInput('');
  
    // Simulating chatbot response (replace this with actual API call when fixed)
    setTimeout(() => {
      setChatHistory([...newChatHistory, { role: 'assistant', content: "I understand you're looking for expertise related to that role. Could you please tell me some specific skills or qualifications that might be important for this position?" }]);
    }, 1000);
  };

  const addManualSkill = () => {
    if (newSkill.name.trim()) {
      setManualExpertise([...manualExpertise, newSkill]);
      setNewSkill({ name: '', rating: 5 });
    }
  };

  const calculateOverallRating = (skills) => {
    const sum = skills.reduce((acc, skill) => acc + skill.rating, 0);
    return skills.length > 0 ? Math.round(sum / skills.length) : 0;
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
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
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Required Expertise
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[...(expertiseEvaluation?.skills || []), ...manualExpertise].map((skill, index) => (
                    <Chip
                      key={index}
                      label={`${skill.name}: ${skill.rating}`}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Skill Name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    sx={{ mr: 2 }}
                  />
                  <Rating
                    value={newSkill.rating}
                    onChange={(_, newValue) => setNewSkill({ ...newSkill, rating: newValue })}
                    max={10}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<PlusCircle />}
                    onClick={addManualSkill}
                    sx={{ ml: 2 }}
                  >
                    Add Skill
                  </Button>
                </Box>
              </Box>
              <TextField
                fullWidth
                margin="normal"
                label="Additional Notes"
                name="requiredExpertise"
                value={form.requiredExpertise}
                onChange={handleChange}
                multiline
                rows={4}
                InputProps={{
                  startAdornment: <Briefcase size={20} style={{ marginRight: 8, alignSelf: 'flex-start', marginTop: 16 }} />,
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
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, mt: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
              Expertise Evaluation Chat
            </Typography>
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              <List>
                {chatHistory.map((msg, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={msg.role === 'assistant' ? 'Chatbot' : 'You'}
                      secondary={msg.content}
                    />
                  </ListItem>
                ))}
                <div ref={chatEndRef} />
              </List>
            </Box>
            <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<Send />}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
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