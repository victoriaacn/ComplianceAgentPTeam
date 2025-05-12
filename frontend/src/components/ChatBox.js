import React, { useState, useRef, useEffect } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import ThinkingEinstein from '../assets/ThinkingEinstein.png';
import { keyframes, styled } from '@mui/material';

const ChatBox = () => {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [riskColor, setRiskColor] = useState('white');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const theme = useTheme();

  const bounce = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  `;

  const EinsteinImage = styled('img')(() => ({
    width: 120,
    height: 120,
    animation: `${bounce} 1.5s ease-in-out infinite`,
  }));

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when responses change
  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handlePromptClick = (prompt) => {
    setQuestion(prompt);
  };

  const getRiskColor = (response) => {
    const responseText = String(response || '').toLowerCase();
    const words = responseText.split(/\s+/);
  
    if (responseText.includes('risk level: high')) {
      return 'red';
    }
    if (responseText.includes('risk level: medium')) {
      return 'yellow';
    }
    if (responseText.includes('risk level: low')) {
      return 'green';
    }
  
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'risk') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'high') {
            return 'red';
          }
        }
      }
      if (words[i] === 'high') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'risk') {
            return 'red';
          }
        }
      }
    }
  
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'risk') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'medium') {
            return 'yellow';
          }
        }
      }
      if (words[i] === 'medium') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'risk') {
            return 'yellow';
          }
        }
      }
    }
  
    for (let i = 0; i < words.length; i++) {
      if (words[i] === 'risk') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'low') {
            return 'green';
          }
        }
      }
      if (words[i] === 'low') {
        for (let j = i + 1; j <= i + 3 && j < words.length; j++) {
          if (words[j] === 'risk') {
            return 'green';
          }
        }
      }
    }
  
    return 'white';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`);
      const data = res.data;

      const responseArray = Array.isArray(data.response) ? data.response : [data.response];

      setResponses((prevResponses) => [...prevResponses, { question, response: responseArray }]);

      const combinedResponse = responseArray.join(' ');
      setRiskColor(getRiskColor(combinedResponse));

      setQuestion('');
    } catch (error) {
      console.error('Error during API request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setResponses([]);
    setRiskColor('white');
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
        height: 600,
        margin: '0 auto',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
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
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: riskColor === 'white' ? 'transparent' : riskColor,
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
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}
        >
          Compliance Risk Indicator
        </Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f0f0f0',
          borderRadius: 2,
          marginTop: 4,
          display: responses.length === 0 ? 'grid' : 'block',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative', // Added for positioning the Einstein image
        }}
      >
        {responses.length === 0 ? (
          <>
            {/* Header Section */}
            <Box
              sx={{
                gridColumn: 'span 2',
                textAlign: 'center',
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.text.primary,
                  marginBottom: 1,
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
               Get started by asking a question or selecting one of the sample questions below:
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
                  justifyContent: 'flex-end',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : theme.palette.primary.light,
                    color: theme.palette.text.primary,
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
                    justifyContent: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
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
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </Box>
        {/* Thinking Einstein Animation - Show when loading */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 3,
              borderRadius: 2,
              width: '200px',
              height: '200px',
              justifyContent: 'center',
            }}
          >
            <EinsteinImage src={ThinkingEinstein} alt="Einstein Thinking" />
            <Typography 
              sx={{ 
                color: 'white', 
                marginTop: 2,
                fontWeight: 'bold'
              }}
            >
              Thinking...
            </Typography>
          </Box>
        )}

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
              backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#ffffff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                color: theme.palette.text.primary,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !question.trim()}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
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