import api from './api';
import { Result } from '../types';

export const resultService = {
  assignMarks: async (data: { examId: number; studentId: number; obtainedMarks: number; remarks?: string }): Promise<Result> => {
    const res = await api.post<Result>('/api/results', data);
    return res.data;
  },
  getByStudent: async (studentId: number): Promise<Result[]> => {
    const res = await api.get<Result[]>(`/api/results/student/${studentId}`);
    return res.data;
  },
  getByExam: async (examId: number): Promise<Result[]> => {
    const res = await api.get<Result[]>(`/api/results/exam/${examId}`);
    return res.data;
  },
  getGpa: async (studentId: number): Promise<number> => {
    const res = await api.get<number>(`/api/results/student/${studentId}/gpa`);
    return res.data;
  },
};
