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
  InputAdornment
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
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E3F2FD'
      }}
    >
      <Paper elevation={3} sx={{ padding: 6, borderRadius: 4, maxWidth: 700, width: '100%' }}>
        <Box textAlign="center" mb={4}>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <CheckCircleOutlineIcon fontSize="large" color="primary" />
            <Typography variant="h4" fontWeight="bold">
              Compliance Agent
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Ask your question..."
            value={question}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ minWidth: 80 }}
                    disabled={loading || !question.trim()}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Ask'}
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </form>

        {responses.length > 0 && (
          <Card
            variant="outlined"
            sx={{ backgroundColor: '#F1F8E9', mt: 2, borderRadius: 2 }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Response</Typography>
                <IconButton onClick={toggleVisibility}>
                  {showResponses ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              <Collapse in={showResponses}>
                <Box mt={2}>
                  <ul>
                    {responses.map((msg, index) => (
                      <li key={index} style={{ marginBottom: 8 }}>{msg}</li>
                    ))}
                  </ul>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  );
}

export default App;
