import React, { useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  createTheme,
  IconButton,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  ThemeProvider,
  Switch,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuIcon from '@mui/icons-material/Menu';
 
function App() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResponses, setShowResponses] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
 
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  });
 
  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponses([]);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`);
      const data = res.data;
      const responseArray = Array.isArray(data.response) ? data.response : [data.response];
      setResponses(responseArray);
    } catch (error) {
      console.error('Error during API request:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const toggleVisibility = () => {
    setShowResponses(!showResponses);
  };
 
  return (
<ThemeProvider theme={theme}>
<CssBaseline />
<AppBar position="static">
<Toolbar>
<IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
<MenuIcon />
</IconButton>
<Typography variant="h6" sx={{ flexGrow: 1 }}>
            Compliance Agent Dashboard
</Typography>
<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
</Toolbar>
</AppBar>
 
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
<Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
<List>
<ListItem button>
<ListItemText primary="Home" />
</ListItem>
<ListItem button>
<ListItemText primary="Reports" />
</ListItem>
<ListItem button>
<ListItemText primary="Settings" />
</ListItem>
</List>
</Box>
</Drawer>
 
      <Container maxWidth="md" sx={{ mt: 5 }}>
<form onSubmit={handleSubmit}>
<Box display="flex" alignItems="center" gap={2} mb={2}>
<TextField
              fullWidth
              label="Ask your question"
              variant="outlined"
              value={question}
              onChange={handleInputChange}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
<Button type="submit" variant="contained" disabled={loading || !question.trim()}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask'}
</Button>
</Box>
</form>
 
        {responses.length > 0 && (
<Card variant="outlined" sx={{ mt: 3, borderRadius: 2 }}>
<CardContent>
<Box display="flex" justifyContent="space-between" alignItems="center">
<Typography variant="h6">Response</Typography>
<IconButton onClick={toggleVisibility}>
                  {showResponses ? <VisibilityOff /> : <Visibility />}
</IconButton>
</Box>
<Collapse in={showResponses}>
<ul style={{ paddingLeft: '1.2rem' }}>
                  {responses.map((msg, index) => (
<li key={index}>
<Typography>{msg}</Typography>
</li>
                  ))}
</ul>
</Collapse>
</CardContent>
</Card>
        )}
</Container>
</ThemeProvider>
  );
}
 
export default App;