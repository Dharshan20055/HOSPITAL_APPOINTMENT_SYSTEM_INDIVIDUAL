import api from './api';

export const adminService = {
  getAllUsers: async (role = null) => {
    const params = role ? { role } : {};
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllDepartments: async () => {
    const response = await api.get('/admin/departments');
    return response.data;
  },

  createDepartment: async (departmentData) => {
    const response = await api.post('/admin/departments', departmentData);
    return response.data;
  },

  deleteDepartment: async (departmentId) => {
    const response = await api.delete(`/admin/departments/${departmentId}`);
    return response.data;
  },

  getAppointmentsPerDoctor: async () => {
    const response = await api.get('/admin/reports/appointments-per-doctor');
    return response.data;
  },

  getRevenuePerDepartment: async () => {
    const response = await api.get('/admin/reports/revenue-per-department');
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.post(`/admin/appointments/${appointmentId}/cancel`);
    return response.data;
  }
};