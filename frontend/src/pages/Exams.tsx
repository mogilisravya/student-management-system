import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  TextField, MenuItem, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { examService } from '../services/examService';
import { courseService } from '../services/courseService';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { Exam, Course } from '../types';
import { useAuth } from '../context/AuthContext';

const Exams: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isStudent = user?.role === 'ROLE_STUDENT';

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue: setEditValue, formState: { errors: errorsEdit } } = useForm();

  // Queries
  const { data: courses } = useQuery({
    queryKey: ['courses-list'],
    queryFn: () => courseService.getAll({ page: 0, size: 100 }),
    enabled: !isStudent,
  });

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: examService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: examService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setOpenAdd(false);
      resetAdd();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => examService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setOpenEdit(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: examService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });

  // Handlers
  const handleAddSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEditSubmit = (data: any) => {
    if (selectedExam) {
      updateMutation.mutate({ id: selectedExam.id, data });
    }
  };

  const handleOpenEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setEditValue('courseId', exam.courseId);
    setEditValue('name', exam.name);
    setEditValue('examDate', exam.examDate);
    setEditValue('totalMarks', exam.totalMarks);
    setOpenEdit(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Exam Schedule
        </Typography>
        {!isStudent && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
            Schedule Exam
          </Button>
        )}
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert severity="error">Error loading examinations details.</Alert>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>SUBJECT / COURSE</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>EXAM NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>EXAM DATE</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>TOTAL MARKS</TableCell>
                  {!isStudent && <TableCell align="right" sx={{ fontWeight: 700 }}>ACTIONS</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {exams?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isStudent ? 4 : 5} align="center">
                      No exams currently scheduled.
                    </TableCell>
                  </TableRow>
                ) : (
                  exams?.map((exam: Exam) => (
                    <TableRow key={exam.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{exam.courseCode} - {exam.courseName}</TableCell>
                      <TableCell>{exam.name}</TableCell>
                      <TableCell>{exam.examDate}</TableCell>
                      <TableCell>{exam.totalMarks} Marks</TableCell>
                      {!isStudent && (
                        <TableCell align="right">
                          <IconButton color="warning" onClick={() => handleOpenEdit(exam)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(exam.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Schedule New Exam</DialogTitle>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Course Catalog"
                  defaultValue=""
                  {...registerAdd('courseId', { required: 'Course is required' })}
                  error={!!errorsAdd.courseId}
                >
                  {courses?.content.map((c: Course) => (
                    <MenuItem key={c.id} value={c.id}>{c.code} - {c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Exam Name (e.g. Midterm)"
                  {...registerAdd('name', { required: 'Exam name is required' })}
                  error={!!errorsAdd.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Exam Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...registerAdd('examDate', { required: 'Exam date is required' })}
                  error={!!errorsAdd.examDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Total Marks"
                  {...registerAdd('totalMarks', { required: 'Total marks required', valueAsNumber: true })}
                  error={!!errorsAdd.totalMarks}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAdd(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmitAdd(handleAddSubmit)} variant="contained" disabled={createMutation.isPending}>
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Exam Schedule</DialogTitle>
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
              <Grid item xs={12}>
                <TextField fullWidth required select label="Course Catalog" {...registerEdit('courseId', { required: 'Course is required' })} error={!!errorsEdit.courseId}>
                  {courses?.content.map((c: Course) => (
                    <MenuItem key={c.id} value={c.id}>{c.code} - {c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Exam Name" {...registerEdit('name', { required: 'Exam name is required' })} error={!!errorsEdit.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label="Exam Date" type="date" InputLabelProps={{ shrink: true }} {...registerEdit('examDate', { required: 'Exam date is required' })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required type="number" label="Total Marks" {...registerEdit('totalMarks', { required: 'Total marks required', valueAsNumber: true })} />
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

export default Exams;
