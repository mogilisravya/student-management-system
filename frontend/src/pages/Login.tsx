import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import SchoolIcon from '@mui/icons-material/School';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({
        username: data.username,
        password: data.password,
      });
      login(response.token, {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <SchoolIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={800} sx={{ mt: 1 }}>
              Portal Login
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
              Enter your credentials to access the console
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username (e.g. admin)"
              autoComplete="username"
              autoFocus
              {...register('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={errors.username?.message as string}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message as string}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: 16, fontWeight: 700 }}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#3b82f6', fontSize: 14, fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

// Simple Avatar override to avoid import issue in standard layouts
const Avatar: React.FC<{ children: React.ReactNode; sx: any }> = ({ children, sx }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default Login;
