import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../layouts/MainLayout';

// Pages
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Teachers from '../pages/Teachers';
import Courses from '../pages/Courses';
import Attendance from '../pages/Attendance';
import Exams from '../pages/Exams';
import Results from '../pages/Results';
import Profile from '../pages/Profile';
import Reports from '../pages/Reports';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students"
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_TEACHER']}>
            <MainLayout>
              <Students />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
            <MainLayout>
              <Teachers />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <PrivateRoute>
            <MainLayout>
              <Courses />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <MainLayout>
              <Attendance />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <PrivateRoute>
            <MainLayout>
              <Exams />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/results"
        element={
          <PrivateRoute>
            <MainLayout>
              <Results />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_TEACHER']}>
            <MainLayout>
              <Reports />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
