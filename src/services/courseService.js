import api from './api';

export const courseService = {
  getCourses: async (params = {}) => {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  getCourseById: async (id) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  createCourse: async (courseData) => {
    const res = await api.post('/courses', courseData);
    return res.data;
  },

  updateCourse: async (id, courseData) => {
    const res = await api.put(`/courses/${id}`, courseData);
    return res.data;
  },

  deleteCourse: async (id) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },
};
