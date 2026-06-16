import api from './api';
import { LoginRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest } from '../types';

// Extend our types locally or import them
export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/api/auth/login', data);
    return res.data;
  },
  forgotPassword: async (data: ForgotPasswordRequest): Promise<string> => {
    const res = await api.post<string>('/api/auth/forgot-password', data);
    return res.data;
  },
  resetPassword: async (data: ResetPasswordRequest): Promise<string> => {
    const res = await api.post<string>('/api/auth/reset-password', data);
    return res.data;
  },
};

