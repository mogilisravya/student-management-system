import api from './api';
import { Course, Student } from '../types';

export const courseService = {
  getAll: async (params?: { search?: string; departmentId?: number; page?: number; size?: number }) => {
    const res = await api.get('/api/courses', { params });
    return res.data;
  },
  getById: async (id: number): Promise<Course> => {
    const res = await api.get<Course>(`/api/courses/${id}`);
    return res.data;
  },
  create: async (data: Partial<Course>): Promise<Course> => {
    const res = await api.post<Course>('/api/courses', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Course>): Promise<Course> => {
    const res = await api.put<Course>(`/api/courses/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/courses/${id}`);
  },
  enrollStudent: async (courseId: number, studentId: number): Promise<void> => {
    await api.post(`/api/courses/${courseId}/enroll/${studentId}`);
  },
  unenrollStudent: async (courseId: number, studentId: number): Promise<void> => {
    await api.delete(`/api/courses/${courseId}/enroll/${studentId}`);
  },
  getEnrolledStudents: async (courseId: number): Promise<Student[]> => {
    const res = await api.get<Student[]>(`/api/courses/${courseId}/students`);
    return res.data;
  },
  getCoursesByStudent: async (studentId: number): Promise<Course[]> => {
    const res = await api.get<Course[]>(`/api/courses/student/${studentId}`);
    return res.data;
  },
  getCoursesByTeacher: async (teacherId: number): Promise<Course[]> => {
    const res = await api.get<Course[]>(`/api/courses/teacher/${teacherId}`);
    return res.data;
  },
};
