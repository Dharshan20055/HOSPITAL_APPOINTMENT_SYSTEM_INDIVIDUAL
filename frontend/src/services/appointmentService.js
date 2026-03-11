import api from './api';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/book', appointmentData);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get('/appointments/my-appointments');
    return response.data;
  },

  getDoctorAppointments: async () => {
    const response = await api.get('/doctor/appointments');
    return response.data;
  },

  confirmAppointment: async (appointmentId) => {
    const response = await api.post(`/appointments/${appointmentId}/confirm`);
    return response.data;
  },

  completeAppointment: async (appointmentId, notes) => {
    const response = await api.post(`/appointments/${appointmentId}/complete`, null, {
      params: { notes }
    });
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.post(`/appointments/${appointmentId}/cancel`);
    return response.data;
  },

  getPatientHistory: async () => {
    const response = await api.get('/doctor/patients/history');
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  }
};