import api from './api';
import { Attendance } from '../types';

export const attendanceService = {
  markBulk: async (data: { courseId: number; date: string; records: { studentId: number; status: string; remarks?: string }[] }): Promise<void> => {
    await api.post('/api/attendance', data);
  },
  getByCourseAndDate: async (courseId: number, date: string): Promise<Attendance[]> => {
    const res = await api.get<Attendance[]>(`/api/attendance/course/${courseId}`, { params: { date } });
    return res.data;
  },
  getByStudent: async (studentId: number): Promise<Attendance[]> => {
    const res = await api.get<Attendance[]>(`/api/attendance/student/${studentId}`);
    return res.data;
  },
};
