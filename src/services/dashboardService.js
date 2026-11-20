import api from './api';

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  getDistribution: async () => {
    const res = await api.get('/dashboard/distribution');
    return res.data;
  },

  getRecentStudents: async (limit = 6) => {
    const res = await api.get(`/dashboard/recent-students?limit=${limit}`);
    return res.data;
  },

  getRecentActivities: async (limit = 8) => {
    const res = await api.get(`/dashboard/recent-activities?limit=${limit}`);
    return res.data;
  },
};
