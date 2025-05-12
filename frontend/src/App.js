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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EinsteinNav from './assets/OfficialNavIcon.png'; // Adjust the path as necessary

// Import your pages
import Welcome from './pages/Welcome';
import AuditPage from './pages/AuditPage';
import ChatPage from './pages/ChatPage';
import RiskAsPage from './pages/RiskAsPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        light: darkMode ? '#4f83cc' : '#88bed4', // Adjusted for dark mode
        dark: darkMode ? '#002f6c' : '#307599',
        main: darkMode ? '#1565c0' : '#3d97bf',
        contrastText: '#fff',
      },
      secondary: {
        light: darkMode ? '#ffab91' : '#e5c3b6', // Adjusted for dark mode
        medium: darkMode ? '#ff7043' : '#d49e88',
        main: darkMode ? '#ff5722' : '#bd4406',
        dark: darkMode ? '#bf360c' : '#842600',
        contrastText: darkMode ? '#fff' : '#000',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5', // Dark mode background
        paper: darkMode ? '#1e1e1e' : '#ffffff', // Card background
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000', // Text color for dark mode
        secondary: darkMode ? '#b0bec5' : '#4f4f4f', // Secondary text color
      },
      success: {
        light: darkMode ? '#81c784' : '#b9f6ca', // Adjusted for dark mode
        main: darkMode ? '#4caf50' : '#00e676',
        dark: darkMode ? '#388e3c' : '#00c853',
        contrastText: '#fff',
      },
      info: {
        light: darkMode ? '#64b5f6' : '#81d4fa', // Adjusted for dark mode
        main: darkMode ? '#2196f3' : '#29b6f6',
        dark: darkMode ? '#1976d2' : '#0288d1',
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  });

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* AppBar */}
        <AppBar position="static" color="primary light">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none', // Remove underline
                
              }}
            >
              <img
                src={EinsteinNav}
                alt="Einstein Navigation"
                style={{
                  height: '100px', // Adjust height as needed
                }}
              />
            </Box>
            <IconButton color="inherit" onClick={handleDarkModeToggle}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Switch checked={darkMode} onChange={handleDarkModeToggle} />
          </Toolbar>
        </AppBar>

        {/* Drawer for Navigation */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem button component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Welcome"
                  sx={{
                    color: theme.palette.text.primary, // Match the text color to the icons
                  }}
                />
              </ListItem>
              <ListItem button component={Link} to="/risk-assessment">
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Risk Assessment"
                  sx={{
                    color: theme.palette.text.primary, // Match the text color to the icons
                  }}
                />
              </ListItem>
              <ListItem button component={Link} to="/audit-processes">
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Audit Processes"
                  sx={{
                    color: theme.palette.text.primary, // Match the text color to the icons
                  }}
                />
              </ListItem>
              <ListItem button component={Link} to="/chat">
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Chat with Einstein"
                  sx={{
                    color: theme.palette.text.primary, // Match the text color to the icons
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: 'calc(100vh - 64px)', // Subtract AppBar height
            backgroundColor: theme.palette.background.default,
            padding: 4,
          }}
        >
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/risk-assessment" element={<RiskAsPage />} />
            <Route path="/audit-processes" element={<AuditPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;