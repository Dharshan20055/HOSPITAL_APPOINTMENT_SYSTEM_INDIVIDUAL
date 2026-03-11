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
  Alert,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { STATUS_COLORS } from '../../utils/constants';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getPatientHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load patient history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(patient =>
    patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
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
        Patient History
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View all completed appointments and patient records
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Search by patient name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {filteredHistory.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No patient history found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Patient</strong></TableCell>
                <TableCell><strong>Contact</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Time</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Notes</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((record, index) => (
                <TableRow key={record.appointmentId || index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {record.patientName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{record.patientEmail}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {record.patientPhone}
                    </Typography>
                  </TableCell>
                  <TableCell>{record.appointmentDate}</TableCell>
                  <TableCell>{record.startTime} - {record.endTime}</TableCell>
                  <TableCell>{record.departmentName || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {record.notes || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={record.status} color={STATUS_COLORS[record.status]} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PatientHistory;