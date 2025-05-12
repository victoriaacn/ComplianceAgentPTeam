import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const RiskTable = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <TableContainer>
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
    </Paper>
  );
};

export default RiskTable;
