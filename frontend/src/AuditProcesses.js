import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';

const AuditProcesses = () => {
  const theme = useTheme(); // Access the current theme

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e3f2fd', // Adjust background for dark mode
        color: theme.palette.text.primary, // Dynamic text color
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Audit Processes
      </Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 1,
          backgroundColor: theme.palette.primary.main, // Use primary color for the button
          color: theme.palette.primary.contrastText, // Ensure text is readable
          '&:hover': {
            backgroundColor: theme.palette.primary.dark, // Darker shade on hover
          },
        }}
      >
        Run Audit & Send Emails
      </Button>
    </Box>
  );
};

export default AuditProcesses;