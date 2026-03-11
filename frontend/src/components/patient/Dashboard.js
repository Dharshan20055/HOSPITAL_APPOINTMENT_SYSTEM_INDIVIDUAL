import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import SearchDoctors from './SearchDoctors';
import BookAppointment from './BookAppointment';
import MyAppointments from './MyAppointments';
import { Box, Tabs, Tab, Container } from '@mui/material';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabValue = () => {
    const path = location.pathname;
    if (path.includes('/patient/search')) return 0;
    if (path.includes('/patient/appointments')) return 1;
    if (path.includes('/patient/book')) return 2;
    return 0;
  };

  const tabValue = getTabValue();

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) navigate('/patient/search');
    if (newValue === 1) navigate('/patient/appointments');
    if (newValue === 2) navigate('/patient/book');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="patient dashboard tabs">
          <Tab label="🔍 Search Doctors" />
          <Tab label="📅 My Appointments" />
          <Tab label="📝 Book Appointment" />
        </Tabs>
      </Box>
      <Routes>
        <Route path="/search" element={<SearchDoctors />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="*" element={<Navigate to="/patient/search" replace />} />
      </Routes>
    </Container>
  );
};

export default PatientDashboard;