import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';

const ConfirmAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [completeDialog, setCompleteDialog] = useState({ open: false, id: null });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getDoctorAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await appointmentService.confirmAppointment(id);
      setSuccess('Appointment confirmed successfully');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm appointment');
    }
  };

  const handleCompleteClick = (id) => {
    setCompleteDialog({ open: true, id });
  };

  const handleCompleteConfirm = async () => {
    try {
      await appointmentService.completeAppointment(completeDialog.id, notes);
      setSuccess('Appointment marked as completed');
      fetchAppointments();
      setCompleteDialog({ open: false, id: null });
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete appointment');
    }
  };

  const pendingAppointments = appointments.filter(
    apt => apt.status === APPOINTMENT_STATUS.BOOKED || apt.status === APPOINTMENT_STATUS.CONFIRMED
  );

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
        Confirm Appointments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review and confirm pending appointment requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {pendingAppointments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No pending appointments
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Time</strong></TableCell>
                <TableCell><strong>Patient</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>{apt.appointmentDate}</TableCell>
                  <TableCell>{apt.startTime} - {apt.endTime}</TableCell>
                  <TableCell>{apt.patientName}</TableCell>
                  <TableCell>
                    <Chip label={apt.status} color={apt.status === 'BOOKED' ? 'warning' : 'primary'} size="small" />
                  </TableCell>
                  <TableCell>
                    {apt.status === APPOINTMENT_STATUS.BOOKED && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleConfirm(apt.id)}
                      >
                        Confirm
                      </Button>
                    )}
                    {apt.status === APPOINTMENT_STATUS.CONFIRMED && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DoneIcon />}
                        onClick={() => handleCompleteClick(apt.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={completeDialog.open} onClose={() => setCompleteDialog({ open: false, id: null })}>
        <DialogTitle>Complete Appointment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Visit Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter diagnosis, treatment, prescriptions..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleCompleteConfirm} variant="contained" disabled={!notes.trim()}>
            Mark Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfirmAppointments;