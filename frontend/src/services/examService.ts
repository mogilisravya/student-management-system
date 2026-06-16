import api from './api';
import { Exam } from '../types';

export const examService = {
  getAll: async (): Promise<Exam[]> => {
    const res = await api.get<Exam[]>('/api/exams');
    return res.data;
  },
  getById: async (id: number): Promise<Exam> => {
    const res = await api.get<Exam>(`/api/exams/${id}`);
    return res.data;
  },
  getByCourse: async (courseId: number): Promise<Exam[]> => {
    const res = await api.get<Exam[]>(`/api/exams/course/${courseId}`);
    return res.data;
  },
  create: async (data: Partial<Exam>): Promise<Exam> => {
    const res = await api.post<Exam>('/api/exams', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Exam>): Promise<Exam> => {
    const res = await api.put<Exam>(`/api/exams/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/exams/${id}`);
  },
};
