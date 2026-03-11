import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import PatientDashboard from './components/patient/Dashboard';
import DoctorDashboard from './components/doctor/Dashboard';
import AdminDashboard from './components/admin/Dashboard';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#4caf50' },
    warning: { main: '#ff9800' },
    error: { main: '#f44336' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/patient/*" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/doctor/*" element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        user ? (
          user.role === 'PATIENT' ? <Navigate to="/patient" replace /> :
          user.role === 'DOCTOR' ? <Navigate to="/doctor" replace /> :
          user.role === 'ADMIN' ? <Navigate to="/admin" replace /> :
          <Navigate to="/login" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;