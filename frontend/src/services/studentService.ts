import api from './api';
import { Student } from '../types';

export const studentService = {
  getAll: async (params: { search?: string; departmentId?: number; semester?: number; page?: number; size?: number }) => {
    const res = await api.get('/api/students', { params });
    return res.data;
  },
  getById: async (id: number): Promise<Student> => {
    const res = await api.get<Student>(`/api/students/${id}`);
    return res.data;
  },
  getByUsername: async (username: string): Promise<Student> => {
    const res = await api.get<Student>(`/api/students/username/${username}`);
    return res.data;
  },
  create: async (data: Partial<Student>): Promise<Student> => {
    const res = await api.post<Student>('/api/students', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Student>): Promise<Student> => {
    const res = await api.put<Student>(`/api/students/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/students/${id}`);
  },
  uploadPhoto: async (id: number, file: File): Promise<Student> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<Student>(`/api/students/${id}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
