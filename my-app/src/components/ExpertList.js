import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, Box } from '@mui/material';
import { Search } from 'lucide-react';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`http://localhost:${process.env.REACT_APP_API_PORT}/api/experts`)
      .then((response) => response.json())
      .then((data) => {
        setExperts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching experts:', error);
        setLoading(false);
      });
  }, []);

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(search.toLowerCase()) ||
    expert.expertise.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Expert List
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
        <Search color="#9e9e9e" size={20} style={{ marginRight: 8 }} />
        <TextField 
          label="Search experts" 
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
          <Table sx={{ minWidth: 650 }} aria-label="expert table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Expertise</TableCell>
                <TableCell align="right">Experience (years)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExperts.map((expert) => (
                <TableRow key={expert.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {expert.name}
                  </TableCell>
                  <TableCell>{expert.expertise}</TableCell>
                  <TableCell align="right">{expert.experience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ExpertList;
