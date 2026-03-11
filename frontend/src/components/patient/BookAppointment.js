import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  
  const [formData, setFormData] = useState({
    doctorId: location.state?.doctorId || '',
    appointmentDate: dayjs(),
    startTime: dayjs().hour(9).minute(0),
    endTime: dayjs().hour(10).minute(0),
    departmentId: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctorId) {
      fetchAvailability();
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
      if (location.state?.doctorId && data.length > 0) {
        const selectedDoctor = data.find(d => d.id === location.state.doctorId);
        if (selectedDoctor) {
          setFormData(prev => ({ ...prev, doctorId: selectedDoctor.id }));
        }
      }
    } catch (err) {
      setError('Failed to load doctors');
    }
  };

  const fetchAvailability = async () => {
    try {
      const data = await doctorService.getDoctorAvailability(formData.doctorId);
      setAvailability(data);
    } catch (err) {
      console.error('Failed to load availability');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, appointmentDate: date });
  };

  const handleTimeChange = (field) => (time) => {
    setFormData({ ...formData, [field]: time });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const appointmentData = {
        doctorId: Number(formData.doctorId),
        appointmentDate: formData.appointmentDate.format('YYYY-MM-DD'),
        startTime: formData.startTime.format('HH:mm:ss'),
        endTime: formData.endTime.format('HH:mm:ss'),
        departmentId: formData.departmentId ? Number(formData.departmentId) : null
      };
      await appointmentService.bookAppointment(appointmentData);
      setSuccess('Appointment booked successfully!');
      setActiveStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Select Doctor', 'Choose Time Slot', 'Confirmation'];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Book New Appointment
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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

        <Card>
          <CardContent>
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Select Doctor"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    label="Appointment Date"
                    value={formData.appointmentDate}
                    onChange={handleDateChange}
                    minDate={dayjs()}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={() => setActiveStep(1)} disabled={!formData.doctorId}>
                    Next
                  </Button>
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleTimeChange('startTime')}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="End Time"
                    value={formData.endTime}
                    onChange={handleTimeChange('endTime')}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={() => setActiveStep(0)} sx={{ mr: 2 }}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
                  </Button>
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Appointment Booked Successfully!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You will receive a confirmation email shortly.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/patient/appointments')}>
                  View My Appointments
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default BookAppointment;