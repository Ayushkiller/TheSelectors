import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Paper, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Dashboard Component
const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/interviews')
      .then((response) => response.json())
      .then((data) => setInterviews(data));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6">Quick Stats</Typography>
        <Typography>Total Interviews: {interviews.length}</Typography>
        <Typography>Pending Expert Assignments: {interviews.filter(interview => !interview.expertAssigned).length}</Typography>
      </Paper>
      <Button variant="contained" color="primary" component={Link} to="/create-interview">
        Create New Interview
      </Button>
    </Container>
  );
};

// CreateInterview Component
const CreateInterview = () => {
  const [interviewData, setInterviewData] = useState({
    subject: '',
    date: '',
    candidateName: '',
    requiredExpertise: '',
  });

  const handleChange = (e) => {
    setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/interviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Interview created:', data);
        // Optionally reset the form or show a success message
        setInterviewData({
          subject: '',
          date: '',
          candidateName: '',
          requiredExpertise: '',
        });
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create New Interview</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Interview Subject"
          name="subject"
          value={interviewData.subject}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          name="date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={interviewData.date}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Candidate Name"
          name="candidateName"
          value={interviewData.candidateName}
          onChange={handleChange}
        />
        <Select
          fullWidth
          margin="normal"
          label="Required Expertise"
          name="requiredExpertise"
          value={interviewData.requiredExpertise}
          onChange={handleChange}
        >
          <MenuItem value="Web Development">Web Development</MenuItem>
          <MenuItem value="Data Science">Data Science</MenuItem>
          <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Create Interview
        </Button>
      </form>
    </Container>
  );
};

// ExpertList Component
const ExpertList = () => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/experts')
      .then((response) => response.json())
      .then((data) => setExperts(data));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Expert List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Expertise</TableCell>
              <TableCell>Experience (years)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experts.map((expert) => (
              <TableRow key={expert.id}>
                <TableCell>{expert.name}</TableCell>
                <TableCell>{expert.expertise}</TableCell>
                <TableCell>{expert.experience}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Interview Panel Selector
          </Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/create-interview">Create Interview</Button>
          <Button color="inherit" component={Link} to="/experts">Experts</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-interview" element={<CreateInterview />} />
          <Route path="/experts" element={<ExpertList />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
