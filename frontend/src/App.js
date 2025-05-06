import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Paper,
  Grid,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function App() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResponses, setShowResponses] = useState(true);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponses([]);

    try {
      const res = await axios.get(`http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`);
      setResponses(res.data.response || []);
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
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: '#B3E5FC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          width: '90%',
          maxWidth: 600,
          backgroundColor: '#E1F5FE',
        }}
      >
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#01579B',
              }}
            >
              Compliance Agent
            </Typography>
          </Grid>
          <Grid item>
            <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#0288D1' }} />
          </Grid>
        </Grid>

        <form onSubmit={handleSubmit}>
          <Box mt={4} display="flex" gap={2}>
            <TextField
              fullWidth
              label="Ask Away!"
              variant="outlined"
              value={question}
              onChange={handleInputChange}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#0288D1',
                '&:hover': { backgroundColor: '#0277BD' },
                minWidth: 80,
              }}
              disabled={loading || !question.trim()}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask'}
            </Button>
          </Box>
        </form>

        {responses.length > 0 && (
          <Card
            variant="outlined"
            sx={{
              backgroundColor: '#B3E5FC',
              mt: 4,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Response
                </Typography>
                <IconButton onClick={toggleVisibility}>
                  {showResponses ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              <Collapse in={showResponses}>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  {responses.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </Collapse>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  );
}

export default App;
