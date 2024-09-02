import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Paper, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Mock data
const mockExperts = [
  { id: 1, name: 'John Doe', expertise: 'Web Development', experience: 5 },
  { id: 2, name: 'Jane Smith', expertise: 'Data Science', experience: 7 },
  { id: 3, name: 'Bob Johnson', expertise: 'UI/UX Design', experience: 4 },
];

// Dashboard Component
const Dashboard = () => (
  <Container>
    <Typography variant="h4" gutterBottom>Dashboard</Typography>
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h6">Quick Stats</Typography>
      <Typography>Total Interviews: 15</Typography>
      <Typography>Pending Expert Assignments: 3</Typography>
    </Paper>
    <Button variant="contained" color="primary" component={Link} to="/create-interview">
      Create New Interview
    </Button>
  </Container>
);

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
    console.log('Interview Data:', interviewData);
    // Placeholder: send this data to the backend
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
const ExpertList = () => (
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
          {mockExperts.map((expert) => (
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
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/create-interview" component={CreateInterview} />
          <Route path="/experts" component={ExpertList} />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
