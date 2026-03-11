import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { SPECIALIZATIONS } from '../../utils/constants';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (spec = '') => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (spec) {
        data = await doctorService.getDoctorsBySpecialization(spec);
      } else {
        data = await doctorService.getAllDoctors();
      }
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDoctors(specialization);
  };

  const handleBookClick = (doctorId) => {
    navigate('/patient/book', { state: { doctorId } });
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
        Find Your Doctor
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Search and book appointments with qualified healthcare professionals
      </Typography>

      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              select
              label="Filter by Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <MenuItem value="">All Specializations</MenuItem>
              {SPECIALIZATIONS.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              size="large"
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {doctors.length === 0 ? (
        <Alert severity="info">No doctors found. Try adjusting your search criteria.</Alert>
      ) : (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} md={6} lg={4} key={doctor.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      {doctor.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MedicalServicesIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialization || 'General Physician'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    📧 {doctor.email}
                  </Typography>
                  {doctor.phone && (
                    <Typography variant="body2" color="text.secondary">
                      📞 {doctor.phone}
                    </Typography>
                  )}
                  <Chip
                    label="Available"
                    color="success"
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
                <CardContent sx={{ pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleBookClick(doctor.id)}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchDoctors;