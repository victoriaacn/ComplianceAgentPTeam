import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Success icon
import ErrorIcon from '@mui/icons-material/Error'; // Error icon
import LaptopEinstein from '../assets/LaptopEinstein.png'; // Assuming you have a separate component for the animated Einstein
const AuditProcesses = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [auditResults, setAuditResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSavedResults, setHasSavedResults] = useState(false);
  // Load saved results from localStorage on component mount
  useEffect(() => {
    const savedResults = localStorage.getItem('auditResults');
    if (savedResults) {
      setHasSavedResults(true);
    }
  }, []);

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/audit');
      if (!response.ok) {
        throw new Error('Failed to run audit');
      }
      const data = await response.json();
      const formattedData = formatAuditResults(data);
      setAuditResults(formattedData);
      localStorage.setItem('auditResults', JSON.stringify(formattedData)); // Save results to localStorage
      setHasSavedResults(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMostRecent = () => {
    const savedResults = localStorage.getItem('auditResults');
    if (savedResults) {
      setAuditResults(JSON.parse(savedResults)); // Load saved results into state
    } else {
      setError('No recent audit results found.');
    }
  };

  const formatAuditResults = (data) => {
    const rows = [];
    Object.entries(data.processes).forEach(([process, employees]) => {
      employees.forEach((employee) => {
        rows.push({
          id: `${process}-${employee.email}`, // Unique ID for each row
          process,
          employeeName: employee.name,
          employeeEmail: employee.email,
          emailResult: data.email_results[process]?.some(
  result =>
    result.toLowerCase().startsWith('success:') &&
    result.toLowerCase().includes(employee.email.toLowerCase())
)
  ? 'Success'
  : 'Failed',


        });
      });
    });
    return rows;
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredResults = auditResults.filter(
    (row) =>
      row.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.employeeEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'process', headerName: 'Process', flex: 1 },
    { field: 'employeeName', headerName: 'Employee Name', flex: 1 },
    { field: 'employeeEmail', headerName: 'Employee Email', flex: 1 },
    {
      field: 'emailResult',
      headerName: 'Email Result',
      flex: 1,
      renderCell: (params) =>
        params.value?.toLowerCase().includes('success') ? (
          <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
        ) : (
          <ErrorIcon sx={{ color: theme.palette.error.main }} />
        ),
    },
  ];

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e3f2fd',
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: 2,
        height: '80vh',
        width: '95vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={LaptopEinstein} 
            alt="Einstein with Laptop" 
            style={{ 
              width: '50px', 
              height: '50px', 
              objectFit: 'contain'
            }} 
          />
          <Typography variant="h6">Audit Processes</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={handleAudit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: theme.palette.primary.contrastText }} />
            ) : (
              'Run Audit'
            )}
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                color: theme.palette.primary.dark,
              },
            }}
            onClick={handleLoadMostRecent}
            disabled={!hasSavedResults}
          >
            Saved Results
          </Button>
        </Box>
      </Box>

      <TextField
        label="Search Employees"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={handleSearch}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={filteredResults}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              color: theme.palette.text.primary,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.primary.main
                  : theme.palette.primary.light,
              color: theme.palette.mode === 'dark'
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary, // Explicitly set text color for light mode
              fontWeight: 'bold', // Optional: Make header text bold for better visibility
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AuditProcesses;