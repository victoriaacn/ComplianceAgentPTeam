import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';

const RiskAssessment = () => {
  const theme = useTheme(); // Access the current theme

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f1f8e9', // Adjust background for dark mode
        color: theme.palette.text.primary, // Dynamic text color
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Risk Assessment
      </Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mb: 2,
          backgroundColor: theme.palette.primary.main, // Use primary color for the button
          color: theme.palette.primary.contrastText, // Ensure text is readable
          '&:hover': {
            backgroundColor: theme.palette.primary.dark, // Darker shade on hover
          },
        }}
      >
        Run Risk Test
      </Button>
      <Box>
        <Typography>High</Typography>
        <Box
          sx={{
            width: '80%',
            height: 10,
            backgroundColor: theme.palette.mode === 'dark' ? '#ff5252' : 'red', // Adjust red for dark mode
            mb: 1,
          }}
        />
        <Typography>Medium</Typography>
        <Box
          sx={{
            width: '50%',
            height: 10,
            backgroundColor: theme.palette.mode === 'dark' ? '#ffb74d' : 'orange', // Adjust orange for dark mode
            mb: 1,
          }}
        />
        <Typography>Low</Typography>
        <Box
          sx={{
            width: '20%',
            height: 10,
            backgroundColor: theme.palette.mode === 'dark' ? '#81c784' : 'green', // Adjust green for dark mode
          }}
        />
      </Box>
    </Box>
  );
};

export default RiskAssessment;