import React, { useState, useEffect } from 'react';
import { Button, Container, Paper, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Calendar, User, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/interviews')
      .then((response) => response.json())
      .then((data) => {
        setInterviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching interviews:', error);
        setLoading(false);
      });
  }, []);

  const filteredInterviews = interviews.filter(interview =>
    interview.subject.toLowerCase().includes(search.toLowerCase()) ||
    interview.candidateName.toLowerCase().includes(search.toLowerCase())
  );

  const pendingAssignments = interviews.filter(interview => !interview.expertAssigned).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Interviews
              </Typography>
              <Typography variant="h5" component="div">
                {interviews.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Expert Assignments
              </Typography>
              <Typography variant="h5" component="div">
                {pendingAssignments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Create New Interview
              </Typography>
              <Button
                component={Link}
                to="/create-interview"
                variant="contained"
                color="primary"
                startIcon={<PlusCircle />}
                sx={{ mt: 1 }}
              >
                New Interview
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
        <Search color="#9e9e9e" size={20} style={{ mr: 1, my: 0.5 }} />
        <TextField 
          label="Search interviews" 
          variant="standard" 
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="interview table">
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
                <TableRow key={interview.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{interview.subject}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Calendar size={16} style={{ marginRight: 8 }} />
                      {new Date(interview.date).toLocaleDateString()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <User size={16} style={{ marginRight: 8 }} />
                      {interview.candidateName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Briefcase size={16} style={{ marginRight: 8 }} />
                      {interview.requiredExpertise}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Dashboard;