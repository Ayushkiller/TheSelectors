import React, { useState } from 'react';
import { Container, Typography, Grid, Box, CircularProgress, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Calendar, User, Briefcase } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '../hooks/useFetch';

const CardStatistic = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const { data: interviews, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/api/interviews`);

  const filteredInterviews = interviews?.filter(interview =>
    interview.subject.toLowerCase().includes(search.toLowerCase()) ||
    interview.candidateName.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const pendingAssignments = interviews?.filter(interview => !interview.expertAssigned).length || 0;
  const completedInterviews = interviews?.filter(interview => interview.status === 'completed').length || 0;

  return (
    <Container maxWidth="lg" className="mt-8 mb-8">
      <Typography variant="h4" className="mb-6">Interview Dashboard</Typography>
      
      <Grid container spacing={4} className="mb-8">
        <Grid item xs={12} sm={6} md={3}>
          <CardStatistic title="Total Interviews" value={interviews?.length || 0} icon={Calendar} />
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
                startIcon={<PlusCircle />}
                className="mt-2"
              >
                New Interview
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="flex items-center mb-4">
        <Search className="mr-2 text-gray-500" size={20} />
        <TextField
          label="Search interviews"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box className="flex justify-center mt-8">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table className="min-w-full" aria-label="interview table">
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
                <TableRow key={interview._id} className="hover:bg-gray-50">
                  <TableCell>{interview.subject}</TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {new Date(interview.date).toLocaleDateString()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <User size={16} className="mr-2" />
                      {interview.candidateName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center">
                      <Briefcase size={16} className="mr-2" />
                      {interview.requiredExpertise}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                      interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {interview.status}
                    </span>
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