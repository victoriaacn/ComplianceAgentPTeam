import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { keyframes } from '@mui/system';
import EinsteinIcon from '../assets/WaveEinstein.png'; // Path to your Einstein icon

export default function Welcome() {
  const theme = useTheme(); // Access the current theme

  // Define a zoom-in animation using keyframes
  const zoomInAnimation = keyframes`
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `;

  const pulseAnimation = keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  `;

  return (
    <Box>
      {/* Full-Screen Landing Section */}
      <Box
        sx={{
          height: 'calc(100vh-64px)', // Full height minus AppBar heigh
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'center',
          background: theme.palette.background.default, // Theme-aware background
          color: theme.palette.text.primary, // Theme-aware text color
          padding: 4,
        }}
      >
        <img
  src={EinsteinIcon}
  alt="Einstein Icon"
  style={{
    width: '200px',
    height: '200px',
    marginBottom: '15px',
    animation: `${zoomInAnimation} 2s ease-in-out`, // Apply zoom-in animation
  }}
/>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: '3.5rem',
            animation: `${zoomInAnimation} 1s ease-in-out`, // Apply the zoom-in animation
            mb: 2,
            '&:hover': {
              color: theme.palette.primary, // Change color on hover
              transform: 'scale(1.1)', // Slight zoom on hover
              transition: 'transform 0.3s ease, color 0.3s ease',
            },
          }}
          gutterBottom
        >
          Welcome to Compliance Einstein
        </Typography>
        <Typography
          variant="h6"
          sx={{
            animation: `${zoomInAnimation} 1.2s ease-in-out`, // Slight delay for subtitle animation
            mb: 4,
          }}
          gutterBottom
        >
          Your AI-powered compliance assistant.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: theme.palette.primary.main, // Primary button color
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 'bold',
            animation: `${pulseAnimation} 2s infinite`, // Add pulsing animation
          }}
          href="/chat"
          startIcon={<ChatIcon />}
        >
          Get Started
        </Button>
      </Box>

      {/* Cards Section */}
      <Box
        sx={{
          padding: 4,
          backgroundColor: theme.palette.background.default, // Theme-aware background
          color: theme.palette.text.primary, // Theme-aware text color
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: theme.palette.background.paper, // Theme-aware card background
                color: theme.palette.text.primary, // Theme-aware text color
                boxShadow: 3,
                borderRadius: '12px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
                '&:hover': {
                  transform: 'scale(1.05)', // Slight zoom on hover
                  boxShadow: 6, // Elevated shadow on hover
                },
              }}
            >
              <CardContent>
                <AssessmentIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Risk Assessment
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Identify and categorize risks with actionable insights to ensure compliance.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: theme.palette.background.paper, // Theme-aware card background
                color: theme.palette.text.primary, // Theme-aware text color
                boxShadow: 3,
                borderRadius: '12px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
                '&:hover': {
                  transform: 'scale(1.05)', // Slight zoom on hover
                  boxShadow: 6, // Elevated shadow on hover
                },
              }}
            >
              <CardContent>
                <ListAltIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Audit Processes
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Streamline your audit processes and track compliance status effortlessly.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: theme.palette.background.paper, // Theme-aware card background
                color: theme.palette.text.primary, // Theme-aware text color
                boxShadow: 3,
                borderRadius: '12px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
                '&:hover': {
                  transform: 'scale(1.05)', // Slight zoom on hover
                  boxShadow: 6, // Elevated shadow on hover
                },
              }}
            >
              <CardContent>
                <ChatIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Chat with Einstein
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Get instant answers to your compliance questions with our AI-powered assistant.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}