import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Container, Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import fadeIn from 'react-animations/lib/fade-in';
import bounce from 'react-animations/lib/bounce';

const fadeInAnimation = keyframes`${fadeIn}`;
const bounceAnimation = keyframes`${bounce}`;

const LoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const messages = [
    'Booting Front End...',
    'Connecting to Backend...',
    'Connecting to MongoDB...',
    'Loading Resources...',
    'Initializing...'
  ];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 2000); // Change message every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null; // Do not render if the tab is not visible
  }

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#282c34',
        color: 'white'
      }}
    >
      <Box mb={4} style={{ animation: `${bounceAnimation} 4s infinite` }}>
        <Typography variant="h3" style={{ animation: `${fadeInAnimation} 4s` }}>
          The Selectors
        </Typography>
      </Box>
      <CircularProgress color="inherit" size={60} />
      <Typography variant="h6" style={{ marginTop: '20px', animation: `${fadeInAnimation} 4s` }}>
        {messages[messageIndex]}
      </Typography>
    </Container>
  );
};

export default LoadingScreen;
