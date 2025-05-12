import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Modal,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import RiskTable from './RiskTable';

const RiskDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const COLORS = ['#f44336', '#ff9800', '#4caf50'];

  // Default (empty) data for initial load
  const defaultRiskData = {
    high: 0,
    medium: 0,
    low: 0
  };

  const handleRunRiskTest = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulated risk data after button click
      setRiskData({ high: 50, medium: 30, low: 20 });
      setLoading(false);
    }, 1000);
  };

  const pieData = riskData
    ? [
        { name: 'High Risk', value: riskData.high },
        { name: 'Medium Risk', value: riskData.medium },
        { name: 'Low Risk', value: riskData.low },
      ]
    : [
        { name: 'High Risk', value: 0 },
        { name: 'Medium Risk', value: 0 },
        { name: 'Low Risk', value: 0 },
      ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
         <Button
        variant="contained"
        onClick={handleRunRiskTest}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? 'Running...' : 'Run Risk Test'}
      </Button>

        <IconButton onClick={() => setInfoModalOpen(true)}>
          <InfoIcon />
        </IconButton>
      </Box>
      
      {/* Render dashboard layout, even before data is loaded */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {[
              { label: 'High Risk', value: riskData ? riskData.high : 0, color: COLORS[0] },
              { label: 'Medium Risk', value: riskData ? riskData.medium : 0, color: COLORS[1] },
              { label: 'Low Risk', value: riskData ? riskData.low : 0, color: COLORS[2] },
            ].map(({ label, value, color }) => (
              <Grid item xs={12} key={label}>
                <Card sx={{ borderLeft: `6px solid ${color}` }}>
                  <CardContent>
                    <Typography variant="h6">{label}</Typography>
                    <Typography variant="h4" color={color}>{value}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Process Risk Breakdown (%)</Typography>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <RiskTable />
        </Grid>
      </Grid>

     
      {/* Modal with additional info */}
      <Modal open={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            maxHeight: '80%',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={() => setInfoModalOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>About Risk Assessment</Typography>
          <Typography>
            This dashboard displays categorized risk insights based on policy violations.
            Use this tool to identify compliance issues by severity.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default RiskDashboard;
