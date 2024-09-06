import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Box, CircularProgress, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Card, CardContent, Button, Alert, AlertTitle
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Calendar, User, Briefcase } from 'lucide-react';
import axios from 'axios';

const CardStatistic = ({ title, value, icon: Icon }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        {Icon && <Icon size={24} />}
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/interviews`);
        setInterviews(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response) {
          setError(`Server Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          setError('Network Error: Unable to reach the server. Please check your internet connection and try again.');
        } else {
          setError(`Error: ${err.message}`);
        }
        console.error('Detailed error:', err);
      }
    };

    fetchInterviews();
  }, []);

  const filteredInterviews = interviews.filter(interview =>
    interview.subject.toLowerCase().includes(search.toLowerCase()) ||
    interview.candidateName.toLowerCase().includes(search.toLowerCase())
  );

  const pendingAssignments = interviews.filter(interview => !interview.expertAssigned).length;
  const completedInterviews = interviews.filter(interview => interview.status === 'completed').length;

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
          <Typography variant="body2" sx={{ mt: 1 }}>
            If this issue persists, please contact support with the following details:
            <br />
            Time: {new Date().toLocaleString()}
            <br />
            API URL: {process.env.REACT_APP_API_URL}
          </Typography>
        </Alert>
      );
    }

    if (interviews.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          <AlertTitle>No Interviews</AlertTitle>
          There are currently no interviews scheduled. Click "Create New Interview" to get started.
        </Alert>
      );
    }

    return (
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="interview table">
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Expertise Required</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterviews.map((interview) => (
              <TableRow key={interview._id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
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
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      fontWeight: 'medium',
                      fontSize: '0.75rem',
                      backgroundColor: interview.status === 'completed' ? 'success.light' :
                                       interview.status === 'scheduled' ? 'info.light' : 'warning.light',
                      color: interview.status === 'completed' ? 'success.dark' :
                             interview.status === 'scheduled' ? 'info.dark' : 'warning.dark',
                    }}
                  >
                    {interview.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Interview Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatistic title="Total Interviews" value={interviews.length} icon={Calendar} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatistic title="Pending Assignments" value={pendingAssignments} icon={User} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatistic title="Completed Interviews" value={completedInterviews} icon={Briefcase} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Create New Interview</Typography>
              <Button
                component={Link}
                to="/create-interview"
                variant="contained"
                color="primary"
                startIcon={<PlusCircle size={16} />}
                sx={{ mt: 1 }}
              >
                New Interview
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Search size={20} style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.54)' }} />
        <TextField
          label="Search interviews"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {renderContent()}
    </Container>
  );
};

export default Dashboard;
