import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  TextField, MenuItem, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { teacherService } from '../services/teacherService';
import { departmentService } from '../services/departmentService';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { Teacher } from '../types';

const Teachers: React.FC = () => {
  const queryClient = useQueryClient();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue: setEditValue, formState: { errors: errorsEdit } } = useForm();

  // Queries
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: teacherService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setOpenAdd(false);
      resetAdd();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => teacherService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setOpenEdit(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teacherService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  // Handlers
  const handleAddSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEditSubmit = (data: any) => {
    if (selectedTeacher) {
      updateMutation.mutate({ id: selectedTeacher.id, data });
    }
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditValue('employeeId', teacher.employeeId);
    setEditValue('name', teacher.name);
    setEditValue('email', teacher.email);
    setEditValue('phone', teacher.phone);
    setEditValue('departmentId', teacher.departmentId);
    setEditValue('qualification', teacher.qualification);
    setEditValue('experience', teacher.experience);
    setOpenEdit(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this teacher and their login account?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Faculty Registry
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
          Register Faculty
        </Button>
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert severity="error">Error loading faculty details.</Alert>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>EMPLOYEE ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>EMAIL</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>DEPARTMENT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>QUALIFICATION</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>EXPERIENCE</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers?.map((teacher: Teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{teacher.employeeId}</TableCell>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.departmentName}</TableCell>
                    <TableCell>{teacher.qualification}</TableCell>
                    <TableCell>{teacher.experience} years</TableCell>
                    <TableCell align="right">
                      <IconButton color="warning" onClick={() => handleOpenEdit(teacher)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(teacher.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Register New Faculty</DialogTitle>
        <DialogContent>
          {createMutation.isError && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {(createMutation.error as any).response?.data?.message || 
               Object.values((createMutation.error as any).response?.data || {}).join(', ') || 
               'An error occurred.'}
            </Alert>
          )}
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Employee ID"
                  {...registerAdd('employeeId', { required: 'Employee ID is required' })}
                  error={!!errorsAdd.employeeId}
                  helperText={errorsAdd.employeeId?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  {...registerAdd('name', { required: 'Name is required' })}
                  error={!!errorsAdd.name}
                  helperText={errorsAdd.name?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  {...registerAdd('email', { required: 'Email is required' })}
                  error={!!errorsAdd.email}
                  helperText={errorsAdd.email?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Contact" {...registerAdd('phone')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Department"
                  defaultValue=""
                  {...registerAdd('departmentId', { required: 'Department is required' })}
                  error={!!errorsAdd.departmentId}
                >
                  {deptData?.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Qualification" {...registerAdd('qualification')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (years)"
                  type="number"
                  {...registerAdd('experience', { valueAsNumber: true })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAdd(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmitAdd(handleAddSubmit)} variant="contained" disabled={createMutation.isPending}>
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Faculty details</DialogTitle>
        <DialogContent>
          {updateMutation.isError && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {(updateMutation.error as any).response?.data?.message || 
               Object.values((updateMutation.error as any).response?.data || {}).join(', ') || 
               'An error occurred.'}
            </Alert>
          )}
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth disabled label="Employee ID" {...registerEdit('employeeId')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  {...registerEdit('name', { required: 'Name is required' })}
                  error={!!errorsEdit.name}
                  helperText={errorsEdit.name?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label="Email Address" {...registerEdit('email')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Contact" {...registerEdit('phone')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Department" {...registerEdit('departmentId')}>
                  {deptData?.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Qualification" {...registerEdit('qualification')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (years)"
                  type="number"
                  {...registerEdit('experience', { valueAsNumber: true })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEdit(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmitEdit(handleEditSubmit)} variant="contained" disabled={updateMutation.isPending}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teachers;
