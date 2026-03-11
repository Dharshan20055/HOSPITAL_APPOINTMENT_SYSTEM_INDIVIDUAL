import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageDepartments from './ManageDepartments';
import Reports from './Reports';
import { Box, Tabs, Tab, Container } from '@mui/material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabValue = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 0;
    if (path.includes('/admin/departments')) return 1;
    if (path.includes('/admin/reports')) return 2;
    return 0;
  };

  const tabValue = getTabValue();

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) navigate('/admin/users');
    if (newValue === 1) navigate('/admin/departments');
    if (newValue === 2) navigate('/admin/reports');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="👥 Manage Users" />
          <Tab label="🏢 Manage Departments" />
          <Tab label="📊 Reports" />
        </Tabs>
      </Box>
      <Routes>
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/departments" element={<ManageDepartments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    </Container>
  );
};

export default AdminDashboard;