import api from './api';
import { Teacher } from '../types';

export const teacherService = {
  getAll: async (): Promise<Teacher[]> => {
    const res = await api.get<Teacher[]>('/api/teachers');
    return res.data;
  },
  getById: async (id: number): Promise<Teacher> => {
    const res = await api.get<Teacher>(`/api/teachers/${id}`);
    return res.data;
  },
  create: async (data: Partial<Teacher>): Promise<Teacher> => {
    const res = await api.post<Teacher>('/api/teachers', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Teacher>): Promise<Teacher> => {
    const res = await api.put<Teacher>(`/api/teachers/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/teachers/${id}`);
  },
};
