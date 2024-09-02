import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';

const Login = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setAuth(data.token);
          navigate('/');
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('Failed to login'));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
