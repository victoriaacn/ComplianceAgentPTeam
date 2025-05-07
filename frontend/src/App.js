import React, { useState } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import ChatBox from './ChatBox'; // Import the ChatBox component
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  });

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Compliance Agent
          </Typography>
          <IconButton color="inherit" onClick={handleDarkModeToggle}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Switch checked={darkMode} onChange={handleDarkModeToggle} />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start', // Align ChatBox to the left
          alignItems: 'center',
          height: 'calc(100vh - 64px)', // Subtract AppBar height
          backgroundColor: theme.palette.background.default,
          paddingLeft: 4, // Add padding to the left for spacing
        }}
      >
        {/* ChatBox takes up half the width */}
        <Box sx={{ width: '50%' }}>
          <ChatBox />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;