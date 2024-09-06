import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress } from '@mui/material';
import Dashboard from './components/Dashboard';
import CreateInterview from './components/CreateInterview';
import ExpertList from './components/ExpertList';
import Login from './components/Login';

const ProtectedRoute = ({ children, auth }) => {
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Verify token with your backend
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/verify-token`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setAuth(true);
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuth(null);
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Interview Panel Selector
          </Typography>
          {auth ? (
            <>
              <Button color="inherit" component={Link} to="/">Dashboard</Button>
              <Button color="inherit" component={Link} to="/create-interview">Create Interview</Button>
              <Button color="inherit" component={Link} to="/experts">Experts</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/" element={
            <ProtectedRoute auth={auth}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-interview" element={
            <ProtectedRoute auth={auth}>
              <CreateInterview />
            </ProtectedRoute>
          } />
          <Route path="/experts" element={
            <ProtectedRoute auth={auth}>
              <ExpertList />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;