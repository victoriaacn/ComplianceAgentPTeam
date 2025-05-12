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
import DashboardEinstein from '../assets/DashboardEinstein.png' // Assuming you have a separate component for the animated Einstein

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
      <Box display="flex"  alignItems="center" mb={2}>
         <Button
        variant="contained"
        onClick={handleRunRiskTest}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Running...' : 'Run Risk Test'}
      </Button>

        <IconButton onClick={() => setInfoModalOpen(true)}>
          <InfoIcon />
        </IconButton>
      </Box>
      
      {/* Render dashboard layout, even before data is loaded */}
{/* Dashboard layout with stacked cards and pie chart side by side */}
<Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={3}>
  {/* Risk Cards - Stack */}
  <Box display="flex" flexDirection="column" gap={3} flexShrink={0}>
    {[
      { label: 'High Risk', value: riskData ? riskData.high : 0, color: COLORS[0] },
      { label: 'Medium Risk', value: riskData ? riskData.medium : 0, color: COLORS[1] },
      { label: 'Low Risk', value: riskData ? riskData.low : 0, color: COLORS[2] },
    ].map(({ label, value, color }) => (
      <Card key={label} sx={{ borderLeft: `6px solid ${color}`, minWidth: 220 }}>
        <CardContent>
          <Typography variant="h6">{label}</Typography>
          <Typography variant="h4" color={color}>{value}%</Typography>
        </CardContent>
      </Card>
    ))}
  </Box>

<Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}  justifyContent= "space-between" alignItems="center" gap={2}flexGrow={1}>
  {/* Pie Chart */}
  <Paper sx={{ p: 2, minWidth: 300 }}>
    <Typography variant="h6" mb={2}>Process Risk Breakdown (%)</Typography>
    <PieChart width={400} height={300}>
      <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={90}
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

  {/* Einstein Image */}
  <Box component="img"
    src={DashboardEinstein}
    alt="Einstein Dashboard Illustration"
    sx={{
      maxWidth: { md: '100%', md: 250 },
      height: 'auto',
      mr: 10,
    }}
  />
</Box>
  
</Box>
{/* Risk Table below the chart and cards */}
<Box mt={3}>
  <RiskTable />
</Box>


     
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
