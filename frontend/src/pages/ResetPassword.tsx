import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import LockResetIcon from '@mui/icons-material/LockReset';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword({
        token: data.token,
        newPassword: data.newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired recovery token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                m: 1,
                bgcolor: 'primary.light',
                color: 'primary.main',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
              }}
            >
              <LockResetIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography component="h1" variant="h5" fontWeight={800} sx={{ mt: 1 }}>
              Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
              Enter the recovery token generated in your backend server terminal
            </Typography>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password updated successfully! You can now log in with your new password.
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {!success ? (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="token"
                label="Recovery Token"
                autoFocus
                {...register('token', { required: 'Recovery token is required' })}
                error={!!errors.token}
                helperText={errors.token?.message as string}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                type="password"
                id="newPassword"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message as string}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: 16, fontWeight: 700 }}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </Button>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 1, py: 1.5, fontSize: 16, fontWeight: 700 }}
            >
              Go to Sign In
            </Button>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#64748b', fontSize: 14, fontWeight: 600 }}>
              Back to Login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ResetPassword;
