import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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
              <TableCell>Experience</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experts.map((expert) => (
              <TableRow key={expert._id}>
                <TableCell>{expert.name}</TableCell>
                <TableCell>{expert.expertise}</TableCell>
                <TableCell>{expert.experience} years</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ExpertList;
