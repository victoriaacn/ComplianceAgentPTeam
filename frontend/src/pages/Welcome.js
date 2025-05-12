import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { keyframes } from '@mui/system';
import AnimatedEinstein from '../components/AnimatedEinstein';
import { Link as RouterLink } from 'react-router-dom';

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
        <AnimatedEinstein />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: '3.5rem',
            animation: `${zoomInAnimation} 1.2s ease-in-out`, // Apply the zoom-in animation
            mb: 2,
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
          Your AI-powered Compliance Assistant
        </Typography>
        <Button
          component={RouterLink}
          to="/chat"
          variant="contained"
          startIcon={<ChatIcon />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 'bold',
            animation: `${pulseAnimation} 2s infinite`,
          }}
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
          alignContent: 'center',
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <RouterLink to="/risk-assessment" style={{ textDecoration: 'none' }}>
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
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    textAlign="center"
                  >
                    <AssessmentIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      Risk Assessment
                    </Typography>
                    <Typography variant="body2">
                      Identify and categorize risks with actionable insights to ensure compliance
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </RouterLink>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RouterLink to="/audit-processes" style={{ textDecoration: 'none' }}>
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
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    textAlign="center"
                  >
                    <ListAltIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      Audit Processes
                    </Typography>
                    <Typography variant="body2">
                      Streamline your audit processes and track compliance status effortlessly
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </RouterLink>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
