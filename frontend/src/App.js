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
                <ListItemText primary="Welcome" />
              </ListItem>
              <ListItem button component={Link} to="/risk-assessment">
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Risk Assessment" />
              </ListItem>
              <ListItem button component={Link} to="/audit-processes">
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="Audit Processes" />
              </ListItem>
              <ListItem button component={Link} to="/chat">
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary="Chat with Einstein" />
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