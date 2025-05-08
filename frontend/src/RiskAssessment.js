import React, { useState } from 'react';
import { Box, Typography, Button, Modal, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const RiskAssessment = () => {
  const theme = useTheme(); // Access the current theme
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [error, setError] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const handleRunRiskTest = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate a delay for testing purposes
      setTimeout(() => {
        const mockData = {
          high: 50,
          medium: 30,
          low: 20,
        };
        setRiskData(mockData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('An error occurred while running the risk test.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f1f8e9', // Adjust background for dark mode
        color: theme.palette.text.primary, // Dynamic text color
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Risk Assessment
        </Typography>
        <IconButton onClick={() => setInfoModalOpen(true)}>
          <InfoIcon />
        </IconButton>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mb: 2,
          backgroundColor: theme.palette.primary.main, // Use primary color for the button
          color: theme.palette.primary.contrastText, // Ensure text is readable
          '&:hover': {
            backgroundColor: theme.palette.primary.dark, // Darker shade on hover
          },
        }}
        onClick={handleRunRiskTest}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Risk Test'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {riskData && (
        <Box>
          <Typography>High Risk: {riskData.high}%</Typography>
          <Box
            sx={{
              width: `${riskData.high}%`,
              height: 10,
              backgroundColor: theme.palette.mode === 'dark' ? '#ff5252' : 'red', // Adjust red for dark mode
              mb: 1,
            }}
          />
          <Typography>Medium Risk: {riskData.medium}%</Typography>
          <Box
            sx={{
              width: `${riskData.medium}%`,
              height: 10,
              backgroundColor: theme.palette.mode === 'dark' ? '#ffb74d' : 'orange', // Adjust orange for dark mode
              mb: 1,
            }}
          />
          <Typography>Low Risk: {riskData.low}%</Typography>
          <Box
            sx={{
              width: `${riskData.low}%`,
              height: 10,
              backgroundColor: theme.palette.mode === 'dark' ? '#81c784' : 'green', // Adjust green for dark mode
            }}
          />
        </Box>
      )}
      <Modal open={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%', // Reduced width for better usability
            maxHeight: '80%', // Limit height to avoid taking up the whole screen
            overflowY: 'auto', // Add scroll for overflow content
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* Add the X button here */}
          <IconButton
            onClick={() => setInfoModalOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Risk Assessment Metrics
          </Typography>
          <Typography gutterBottom>
            Risks are categorized as High, Medium, or Low based on the severity and potential impact of non-compliance with company policies:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Policy Area</strong></TableCell>
                  <TableCell><strong>Risk Level</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Acceptable Use of Technology</TableCell>
                  <TableCell>🔴 High</TableCell>
                  <TableCell>Unencrypted data on personal devices or unauthorized VPNs expose company to data breaches and violations.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Document Management & Retention</TableCell>
                  <TableCell>🔴 High</TableCell>
                  <TableCell>Storing official documents outside approved systems undermines audit readiness and legal compliance.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Change Management</TableCell>
                  <TableCell>🔴 High</TableCell>
                  <TableCell>Lack of CAB review or risk assessments can cause outages and untraceable errors.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Information Security</TableCell>
                  <TableCell>🔴 High</TableCell>
                  <TableCell>Bypassing endpoint protection or MFA creates critical vulnerabilities.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Procurement & Vendor Management</TableCell>
                  <TableCell>🔴 High</TableCell>
                  <TableCell>Skipping vetting/legal review risks fraud, reputational harm, and vendor mismanagement.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Audit Readiness & Compliance</TableCell>
                  <TableCell>🔴 High</TableCell>
                  <TableCell>Missing audit evidence or repeated non-remediation triggers regulatory risk.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Remote Work & Flex Scheduling</TableCell>
                  <TableCell>🟡 Medium</TableCell>
                  <TableCell>Use of personal devices or networks adds risk if security policies are not fully followed.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Expense Reimbursement</TableCell>
                  <TableCell>🟡 Medium</TableCell>
                  <TableCell>Late or unauthorized bookings pose financial control issues, but manageable.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Employee Conduct & Ethics</TableCell>
                  <TableCell>🟡 Medium</TableCell>
                  <TableCell>Unreported conflicts or accepting gifts under threshold carry perception and integrity risks.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Policy Update Process</TableCell>
                  <TableCell>🟢 Low</TableCell>
                  <TableCell>Operational inefficiency if changes not tracked, but little legal/regulatory impact.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Performance Feedback Process</TableCell>
                  <TableCell>🟢 Low</TableCell>
                  <TableCell>Impacts team growth or morale, but not a compliance issue.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Box>
  );
};

export default RiskAssessment;