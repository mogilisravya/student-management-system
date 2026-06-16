import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword({ email: data.email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
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
              <EmailIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography component="h1" variant="h5" fontWeight={800} sx={{ mt: 1 }}>
              Recover Password
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
              Enter your email and check the server console logs for recovery token
            </Typography>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Reset token has been generated and printed in the backend server logs. Please copy it and click the reset link below.
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {!success ? (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: 16, fontWeight: 700 }}
              >
                {loading ? 'Submitting...' : 'Send Recovery Link'}
              </Button>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/reset-password')}
              sx={{ mt: 1, py: 1.5, fontSize: 16, fontWeight: 700 }}
            >
              Go to Password Reset
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

export default ForgotPassword;
