import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ManageAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    availableDate: dayjs(),
    startTime: dayjs().hour(9).minute(0),
    endTime: dayjs().hour(10).minute(0)
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getMyAvailability();
      setAvailability(data);
    } catch (err) {
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddAvailability = async () => {
    setError('');
    try {
      const availabilityData = {
        availableDate: formData.availableDate.format('YYYY-MM-DD'),
        startTime: formData.startTime.format('HH:mm:ss'),
        endTime: formData.endTime.format('HH:mm:ss')
      };
      await doctorService.addAvailability(availabilityData);
      setSuccess('Availability slot added successfully');
      fetchAvailability();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add availability');
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Manage Availability
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Set your available time slots for appointments
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add New Slot
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <DatePicker
                      label="Date"
                      value={formData.availableDate}
                      onChange={handleChange('availableDate')}
                      minDate={dayjs()}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TimePicker
                      label="Start Time"
                      value={formData.startTime}
                      onChange={handleChange('startTime')}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TimePicker
                      label="End Time"
                      value={formData.endTime}
                      onChange={handleChange('endTime')}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddAvailability}
                      startIcon={<AddIcon />}
                    >
                      Add Availability
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Availability Slots
                </Typography>
                {availability.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AccessTimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="text.secondary">No availability slots set</Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Date</strong></TableCell>
                          <TableCell><strong>Time Slot</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {availability.map((slot) => (
                          <TableRow key={slot.id}>
                            <TableCell>{slot.availableDate}</TableCell>
                            <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                            <TableCell>
                              <Chip
                                label={slot.isBooked ? 'Booked' : 'Available'}
                                color={slot.isBooked ? 'default' : 'success'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default ManageAvailability;