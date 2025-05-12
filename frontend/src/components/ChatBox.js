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

  const handlePromptClick = (prompt) => {
    setQuestion(prompt); // Autofill the input field with the selected prompt
  };

  const getRiskColor = (response) => {
    const responseText = String(response || '').toLowerCase(); // Ensure response is a string and convert to lowercase
    const words = responseText.split(/\s+/); // Split response into words
  
    // Check for explicit "Risk Level: High", "Risk Level: Medium", or "Risk Level: Low"
    if (responseText.includes('risk level: high')) {
      return 'red'; // High risk
    }
    if (responseText.includes('risk level: medium')) {
      return 'yellow'; // Medium risk
    }
    if (responseText.includes('risk level: low')) {
      return 'green'; // Low risk
    }
  
    // Check for "high risk" within 3 words
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'risk') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'high') {
            return 'red'; // High risk
          }
        }
      }
      if (words[i] === 'high') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'risk') {
            return 'red'; // High risk
          }
        }
      }
    }
  
    // Check for "medium risk" within 3 words
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'risk') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'medium') {
            return 'yellow'; // Medium risk
          }
        }
      }
      if (words[i] === 'medium') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'risk') {
            return 'yellow'; // Medium risk
          }
        }
      }
    }
  
    // Check for "low risk" within 3 words
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'risk') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'low') {
            return 'green'; // Low risk
          }
        }
      }
      if (words[i] === 'low') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'risk') {
            return 'green'; // Low risk
          }
        }
      }
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

  const promptIdeas = [
    'What are the most common compliance violations to avoid?',
    'What approvals are required for financial or legal decisions?',
    'What are the rules for handling sensitive or production data?',
    'What documentation is required for audits or legal reviews?',
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        height: 600, // Fixed height for the chat box
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
          overflowY: 'auto',
          padding: 2,
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f0f0f0', // Inner box color
          borderRadius: 2,
          marginTop: 4, // Add more white space above the grey box
          display: responses.length === 0 ? 'grid' : 'block', // Show grid layout for prompts if no chats
          gridTemplateColumns: '1fr 1fr',
          gap: 1, // Reduced gap between rectangles
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {responses.length === 0 ? (
          <>
            {/* Header Section */}
            <Box
              sx={{
                gridColumn: 'span 2', // Center the header across both columns
                textAlign: 'center',
                marginBottom: 2, // Add spacing below the header
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.text.primary,
                  marginBottom: 1, // Add spacing below the title
                }}
              >
                Welcome to Einstein Chat
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                Your assistant for all your compliance needs. Get started by asking a question or selecting one of the sample questions below.
              </Typography>
            </Box>

            {/* Prompt Ideas */}
            {promptIdeas.map((prompt, index) => (
              <Box
                key={index}
                onClick={() => handlePromptClick(prompt)}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#e0e0e0',
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  padding: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#3a3a3a' : '#d6d6d6',
                  },
                }}
              >
                {prompt}
              </Box>
            ))}
          </>
        ) : (
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