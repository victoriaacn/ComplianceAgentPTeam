import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the trash icon
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip

const ChatBox = () => {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]); // Stores all questions and responses
  const [loading, setLoading] = useState(false);
  const [riskColor, setRiskColor] = useState('white'); // Default compliance risk indicator color

  const theme = useTheme(); // Access the current theme (dark or light mode)

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const getRiskColor = (response) => {
    const responseText = String(response || ''); // Ensure response is a string
    if (responseText.toLowerCase().includes('high risk') || responseText.toLowerCase().includes('violate')) {
      return 'red'; // High risk
    }
    if (responseText.toLowerCase().includes('medium risk') || responseText.toLowerCase().includes('warning')) {
      return 'yellow'; // Medium risk
    }
    return 'white'; // Neutral/low risk
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`);
      const data = res.data;

      // Ensure response is an array
      const responseArray = Array.isArray(data.response) ? data.response : [data.response];

      // Add the question and response(s) to the responses state
      setResponses((prevResponses) => [...prevResponses, { question, response: responseArray }]);

      // Update the compliance risk indicator color
      const combinedResponse = responseArray.join(' ');
      setRiskColor(getRiskColor(combinedResponse));

      setQuestion(''); // Clear the input field after submitting
    } catch (error) {
      console.error('Error during API request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setResponses([]); // Clear all chat messages
    setRiskColor('white'); // Reset the compliance risk indicator
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!');
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        height: 500, // Fixed height for the chat box
        margin: '0 auto',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff', // Outer box color
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Compliance Risk Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 20, // Smaller circle
            height: 20,
            borderRadius: '50%',
            backgroundColor: riskColor === 'white' ? 'transparent' : riskColor, // Empty center for neutral
            border: '2px solid grey',
            boxShadow: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {riskColor !== 'white' && <CircleIcon sx={{ fontSize: 16, color: riskColor }} />}
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary, // Dynamic text color
            fontSize: '0.75rem',
          }}
        >
          Compliance Risk Indicator
        </Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto', // Scrollable area for chat messages
          padding: 2,
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f0f0f0', // Inner box color
          borderRadius: 2,
          marginTop: 4, // Add more white space above the grey box
        }}
      >
        {responses.length > 0 ? (
          responses.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {/* User's Question */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end', // Align to the right
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : theme.palette.primary.light, // Darker background for dark mode
                    color: theme.palette.text.primary, // Dynamic text color
                    borderRadius: 2,
                    maxWidth: '70%',
                    padding: 2,
                    boxShadow: 2,
                  }}
                >
                  <Typography>{item.question}</Typography>
                  <IconButton onClick={() => handleCopy(item.question)} sx={{ ml: 1 }}>
                    <ContentCopyIcon sx={{ color: theme.palette.text.primary }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Bot's Response(s) */}
              {item.response.map((response, responseIndex) => (
                <Box
                  key={responseIndex}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start', // Align to the left
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main, // Dynamic dark blue
                      color: theme.palette.primary.contrastText, // Dynamic text color
                      borderRadius: 2,
                      maxWidth: '70%',
                      padding: 2,
                      boxShadow: 2,
                    }}
                  >
                    <Typography>{response}</Typography>
                    <IconButton onClick={() => handleCopy(response)} sx={{ ml: 1 }}>
                      <ContentCopyIcon sx={{ color: theme.palette.primary.contrastText }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            No messages yet. Ask a question to get started!
          </Typography>
        )}
      </Box>

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" gap={2} mt={2}>
          <TextField
            fullWidth
            label="Type your question"
            variant="outlined"
            value={question}
            onChange={handleInputChange}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#ffffff', // Dynamic input background
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                color: theme.palette.text.primary, // Dynamic text color
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !question.trim()}
            sx={{
              backgroundColor: theme.palette.primary.main, // Dynamic button color
              color: theme.palette.primary.contrastText, // Dynamic text color
              '&:hover': {
                backgroundColor: theme.palette.primary.dark, // Darker shade on hover
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask'}
          </Button>
        </Box>
      </form>

      {/* Clear Chat Button */}
      {responses.length > 0 && (
        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2} gap={1}>
          <Tooltip title="Clear Chat" arrow>
            <IconButton
              color="secondary"
              onClick={handleClearChat}
              sx={{
                textTransform: 'none',
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;