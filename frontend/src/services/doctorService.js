import api from './api';

export const doctorService = {
  getAllDoctors: async () => {
    const response = await api.get('/patient/doctors');
    return response.data;
  },

  getDoctorsBySpecialization: async (specialization) => {
    const response = await api.get('/patient/doctors', {
      params: { specialization }
    });
    return response.data;
  },

  getDoctorAvailability: async (doctorId) => {
    const response = await api.get(`/patient/doctors/${doctorId}/availability`);
    return response.data;
  },

  getMyAvailability: async () => {
    const response = await api.get('/doctor/availability');
    return response.data;
  },

  addAvailability: async (availabilityData) => {
    const response = await api.post('/doctor/availability', availabilityData);
    return response.data;
  },

  deleteAvailability: async (availabilityId) => {
    const response = await api.delete(`/doctor/availability/${availabilityId}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};