import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ScheduleView from './ScheduleView';
import ConfirmAppointments from './ConfirmAppointments';
import PatientHistory from './PatientHistory';
import ManageAvailability from './ManageAvailability';
import { Box, Tabs, Tab, Container } from '@mui/material';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabValue = () => {
    const path = location.pathname;
    if (path.includes('/doctor/schedule')) return 0;
    if (path.includes('/doctor/confirm')) return 1;
    if (path.includes('/doctor/history')) return 2;
    if (path.includes('/doctor/availability')) return 3;
    return 0;
  };

  const tabValue = getTabValue();

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) navigate('/doctor/schedule');
    if (newValue === 1) navigate('/doctor/confirm');
    if (newValue === 2) navigate('/doctor/history');
    if (newValue === 3) navigate('/doctor/availability');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="doctor dashboard tabs">
          <Tab label="📅 Schedule" />
          <Tab label="✅ Confirm Appointments" />
          <Tab label="📋 Patient History" />
          <Tab label="⏰ Manage Availability" />
        </Tabs>
      </Box>
      <Routes>
        <Route path="/schedule" element={<ScheduleView />} />
        <Route path="/confirm" element={<ConfirmAppointments />} />
        <Route path="/history" element={<PatientHistory />} />
        <Route path="/availability" element={<ManageAvailability />} />
        <Route path="*" element={<Navigate to="/doctor/schedule" replace />} />
      </Routes>
    </Container>
  );
};

export default DoctorDashboard;