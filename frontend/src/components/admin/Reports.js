import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Reports = () => {
  const [doctorStats, setDoctorStats] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [doctorData, departmentData] = await Promise.all([
        adminService.getAppointmentsPerDoctor(),
        adminService.getRevenuePerDepartment()
      ]);
      setDoctorStats(doctorData || []);
      setDepartmentStats(departmentData || []);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View system statistics and performance metrics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Appointments Per Doctor</Typography>
              </Box>
              {doctorStats.length === 0 ? (
                <Typography color="text.secondary">No data available</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Doctor</strong></TableCell>
                        <TableCell align="right"><strong>Appointments</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {doctorStats.map((stat) => (
                        <TableRow key={stat.doctorId}>
                          <TableCell>{stat.doctorName}</TableCell>
                          <TableCell align="right">{stat.appointmentCount || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Revenue Per Department</Typography>
              </Box>
              {departmentStats.length === 0 ? (
                <Typography color="text.secondary">No data available</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Department</strong></TableCell>
                        <TableCell align="right"><strong>Appointments</strong></TableCell>
                        <TableCell align="right"><strong>Revenue</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departmentStats.map((stat) => (
                        <TableRow key={stat.departmentId}>
                          <TableCell>{stat.departmentName}</TableCell>
                          <TableCell align="right">{stat.totalAppointments || 0}</TableCell>
                          <TableCell align="right">${stat.totalRevenue || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">System Summary</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {doctorStats.reduce((sum, s) => sum + (s.appointmentCount || 0), 0)}
                    </Typography>
                    <Typography variant="body2">Total Appointments</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {departmentStats.length}
                    </Typography>
                    <Typography variant="body2">Active Departments</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h4" fontWeight="bold">
                      ${departmentStats.reduce((sum, s) => sum + (s.totalRevenue || 0), 0)}
                    </Typography>
                    <Typography variant="body2">Total Revenue</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;