import React, { useState } from 'react';
import {
  Container, Typography, Grid, Box, CircularProgress, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Calendar, User, Briefcase } from 'lucide-react';
import CardStatistic from './CardStatistic'; 
import useFetch from '../hooks/useFetch'; 

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const { data: interviews, loading, error } = useFetch(`http://${process.env.REACT_APP_API_PORT}/api/interviews`);

  const filteredInterviews = interviews?.filter(interview =>
    interview.subject.toLowerCase().includes(search.toLowerCase()) ||
    interview.candidateName.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const pendingAssignments = interviews?.filter(interview => !interview.expertAssigned).length || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <CardStatistic title="Total Interviews" value={interviews?.length || 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CardStatistic title="Pending Expert Assignments" value={pendingAssignments} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Create New Interview</Typography>
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
        <Search color="#9e9e9e" size={20} style={{ marginRight: 8 }} />
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
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
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
                <TableRow key={interview._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
