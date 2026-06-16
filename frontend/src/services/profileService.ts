import api from './api';
import { Profile, Student } from '../types';
import { ChangePasswordRequest } from './authService';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const res = await api.get<Profile>('/api/profile');
    return res.data;
  },
  updateProfile: async (data: { email?: string; phone?: string; address?: string }): Promise<void> => {
    await api.put('/api/profile', data);
  },
  changePassword: async (data: ChangePasswordRequest): Promise<string> => {
    const res = await api.post<string>('/api/profile/change-password', data);
    return res.data;
  },
  uploadPhoto: async (file: File): Promise<Student> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<Student>('/api/profile/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
