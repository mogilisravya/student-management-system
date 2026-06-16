import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Grid, Card, CardContent, TextField, Button, Avatar, Divider,
  IconButton, Alert, Chip
} from '@mui/material';
import { PhotoCamera as CameraIcon, Save as SaveIcon, Lock as LockIcon } from '@mui/icons-material';
import { profileService } from '../services/profileService';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pwdErrorMsg, setPwdErrorMsg] = useState<string | null>(null);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, setValue } = useForm();
  const { register: registerPwd, handleSubmit: handleSubmitPwd, reset: resetPwd } = useForm();

  // Queries
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });

  // Populate form values once profile is loaded
  React.useEffect(() => {
    if (profile) {
      setValue('email', profile.email);
      setValue('phone', profile.phone || profile.mobileNumber || '');
      setValue('address', profile.address || '');
    }
  }, [profile, setValue]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      setSuccessMsg('Profile details updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Error updating details');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => {
      setPwdSuccessMsg('Password changed successfully!');
      resetPwd();
    },
    onError: (err: any) => {
      setPwdErrorMsg(err.response?.data?.message || 'Error changing password');
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: profileService.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Avatar uploaded successfully!');
    },
  });

  // Handlers
  const handleUpdateProfile = (data: any) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    updateProfileMutation.mutate(data);
  };

  const handleChangePassword = (data: any) => {
    setPwdSuccessMsg(null);
    setPwdErrorMsg(null);
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadPhotoMutation.mutate(e.target.files[0]);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        My Profile & Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Info summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 4 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={profile?.profilePhoto}
                  sx={{ width: 120, height: 120, fontSize: 36, fontWeight: 700, bgcolor: 'primary.main' }}
                >
                  {profile?.username?.charAt(0)?.toUpperCase() || ''}
                </Avatar>
                {profile?.role === 'ROLE_STUDENT' && (
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute', bottom: 0, right: 0,
                      bgcolor: 'primary.main', color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <CameraIcon />
                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h5" fontWeight={800}>
                {profile?.role === 'ROLE_STUDENT' ? `${profile?.firstName || ''} ${profile?.lastName || ''}` : profile?.teacherName || profile?.username || ''}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profile?.role?.replace('ROLE_', '') || ''}
              </Typography>
              <Chip label={profile?.email || ''} size="small" variant="outlined" />

              <Divider sx={{ width: '100%', my: 3 }} />

              <Grid container spacing={2} sx={{ textAlign: 'left', px: 1 }}>
                <Grid item xs={6}><Typography variant="body2" fontWeight={700}>System ID</Typography></Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {profile?.studentId || profile?.employeeId || 'ADMIN'}
                  </Typography>
                </Grid>
                {profile?.departmentName && (
                  <>
                    <Grid item xs={6}><Typography variant="body2" fontWeight={700}>Department</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">{profile?.departmentName}</Typography></Grid>
                  </>
                )}
                {profile?.semester && (
                  <>
                    <Grid item xs={6}><Typography variant="body2" fontWeight={700}>Semester</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Semester {profile?.semester}</Typography></Grid>
                  </>
                )}
                {profile?.qualification && (
                  <>
                    <Grid item xs={6}><Typography variant="body2" fontWeight={700}>Qualification</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">{profile?.qualification}</Typography></Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Update Profile Form */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            {/* Edit details */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                    Update Personal Information
                  </Typography>

                  {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
                  {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                  <Box component="form" onSubmit={handleSubmitProfile(handleUpdateProfile)}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          required
                          {...registerProfile('email')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Contact"
                          {...registerProfile('phone')}
                        />
                      </Grid>
                      {profile?.role === 'ROLE_STUDENT' && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Residential Address"
                            multiline
                            rows={3}
                            {...registerProfile('address')}
                          />
                        </Grid>
                      )}
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', mt: 1 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={updateProfileMutation.isPending}
                        >
                          Save Profile
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Change Password Card */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                    Change Account Password
                  </Typography>

                  {pwdSuccessMsg && <Alert severity="success" sx={{ mb: 2 }}>{pwdSuccessMsg}</Alert>}
                  {pwdErrorMsg && <Alert severity="error" sx={{ mb: 2 }}>{pwdErrorMsg}</Alert>}

                  <Box component="form" onSubmit={handleSubmitPwd(handleChangePassword)}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Current Password"
                          required
                          {...registerPwd('oldPassword')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="password"
                          label="New Secure Password"
                          required
                          {...registerPwd('newPassword')}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', mt: 1 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          startIcon={<LockIcon />}
                          disabled={changePasswordMutation.isPending}
                        >
                          Change Password
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
