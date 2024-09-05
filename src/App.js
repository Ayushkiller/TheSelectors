import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import CreateInterview from './components/CreateInterview';
import ExpertList from './components/ExpertList';
import Login from './components/Login';

const App = () => {
  const [auth, setAuth] = useState(null);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Interview Panel Selector
          </Typography>
          {auth ? (
            <>
              <Button color="inherit" href="/">Dashboard</Button>
              <Button color="inherit" href="/create-interview">Create Interview</Button>
              <Button color="inherit" href="/experts">Experts</Button>
            </>
          ) : (
            <Button color="inherit" href="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-interview" element={<CreateInterview />} />
          <Route path="/experts" element={<ExpertList />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
