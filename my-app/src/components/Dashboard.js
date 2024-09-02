import React, { useState, useEffect } from 'react';
import { Button, Container, Paper, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredInterviews, setFilteredInterviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/interviews')
      .then((response) => response.json())
      .then((data) => setInterviews(data));
  }, []);

  useEffect(() => {
    setFilteredInterviews(
      interviews.filter(interview => 
        interview.subject.toLowerCase().includes(search.toLowerCase()) || 
        interview.candidateName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, interviews]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6">Quick Stats</Typography>
        <Typography>Total Interviews: {interviews.length}</Typography>
        <Typography>Pending Expert Assignments: {interviews.filter(interview => !interview.expertAssigned).length}</Typography>
      </Paper>
      <TextField
        fullWidth
        margin="normal"
        label="Search Interviews"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Expertise Required</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterviews.map((interview) => (
              <TableRow key={interview._id}>
                <TableCell>{interview.subject}</TableCell>
                <TableCell>{new Date(interview.date).toLocaleDateString()}</TableCell>
                <TableCell>{interview.candidateName}</TableCell>
                <TableCell>{interview.requiredExpertise}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" component={Link} to="/create-interview" style={{ marginTop: '20px' }}>
        Create New Interview
      </Button>
    </Container>
  );
};

export default Dashboard;
