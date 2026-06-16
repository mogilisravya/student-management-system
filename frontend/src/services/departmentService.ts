import api from './api';
import { Department } from '../types';

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const res = await api.get<Department[]>('/api/departments');
    return res.data;
  },
};
