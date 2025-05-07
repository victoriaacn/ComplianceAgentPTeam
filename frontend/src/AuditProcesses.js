import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, useTheme } from '@mui/material';

const AuditProcesses = () => {
  const theme = useTheme(); // Access the current theme
  const [loading, setLoading] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);

  // Load saved audit results from localStorage on component mount
  useEffect(() => {
    const savedResults = localStorage.getItem('auditResults');
    if (savedResults) {
      setAuditResults(JSON.parse(savedResults));
    }
  }, []);

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/audit'); // Replace with your backend URL
      if (!response.ok) {
        throw new Error('Failed to run audit');
      }
      const data = await response.json();
      setAuditResults(data); // Save the results directly in state
      localStorage.setItem('auditResults', JSON.stringify(data)); // Save results to localStorage
      setShowModal(true); // Open the modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e3f2fd', // Adjust background for dark mode
        color: theme.palette.text.primary, // Dynamic text color
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Audit Processes
      </Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 1,
          backgroundColor: theme.palette.primary.main, // Use primary color for the button
          color: theme.palette.primary.contrastText, // Ensure text is readable
          '&:hover': {
            backgroundColor: theme.palette.primary.dark, // Darker shade on hover
          },
        }}
        onClick={handleAudit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: theme.palette.primary.contrastText }} /> : 'Run Audit & Send Emails'}
      </Button>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setShowModal(true)} // Reopen the modal
        disabled={!auditResults} // Disable the button if no results are available
      >
        View Saved Results
      </Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {showModal && auditResults && (
        <AuditResultsModal
          results={auditResults}
          page={page}
          rowsPerPage={rowsPerPage}
          onClose={() => setShowModal(false)}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </Box>
  );
};

const AuditResultsModal = ({ results, page, rowsPerPage, onClose, onChangePage, onChangeRowsPerPage }) => {
  const processes = Object.entries(results.processes);
  const emailResults = results.email_results;

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Audit Results
        </Typography>
        {processes.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Process</strong></TableCell>
                    <TableCell><strong>Employees Emailed</strong></TableCell>
                    <TableCell><strong>Email Results</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(([process, employees]) => (
                      <TableRow key={process}>
                        <TableCell>{process}</TableCell>
                        <TableCell>{employees.join(', ')}</TableCell>
                        <TableCell>
                          {Array.isArray(emailResults[process])
                            ? emailResults[process].join(', ')
                            : emailResults[process]}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={processes.length}
              page={page}
              onPageChange={onChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={onChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        ) : (
          <Typography>No audit results available.</Typography>
        )}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default AuditProcesses;