import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  TextField, MenuItem, Alert, Chip, Divider, ListItem, ListItemText, List, ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, PersonAdd as EnrollIcon,
  RemoveCircleOutline as UnenrollIcon
} from '@mui/icons-material';
import { courseService } from '../services/courseService';
import { teacherService } from '../services/teacherService';
import { departmentService } from '../services/departmentService';
import { studentService } from '../services/studentService';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { Course, Student } from '../types';
import { useAuth } from '../context/AuthContext';

const Courses: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isTeacher = user?.role === 'ROLE_TEACHER';

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEnroll, setOpenEnroll] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Enrollment selection
  const [enrollStudentId, setEnrollStudentId] = useState<number | string>('');

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue: setEditValue, formState: { errors: errorsEdit } } = useForm();

  // Queries
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const { data: teacherData } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getAll,
    enabled: isAdmin,
  });

  // Get all students (simplified list for enrollment selector)
  const { data: allStudentsData } = useQuery({
    queryKey: ['students-list'],
    queryFn: () => studentService.getAll({ page: 0, size: 100 }),
    enabled: openEnroll,
  });

  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll({ page: 0, size: 100 }),
  });

  // Query enrolled students for selected course
  const { data: enrolledStudents, refetch: refetchEnrolled } = useQuery({
    queryKey: ['enrolled-students', selectedCourse?.id],
    queryFn: () => courseService.getEnrolledStudents(selectedCourse!.id),
    enabled: !!selectedCourse && openEnroll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setOpenAdd(false);
      resetAdd();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => courseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setOpenEdit(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: courseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const enrollMutation = useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: number; studentId: number }) =>
      courseService.enrollStudent(courseId, studentId),
    onSuccess: () => {
      refetchEnrolled();
      setEnrollStudentId('');
    },
  });

  const unenrollMutation = useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: number; studentId: number }) =>
      courseService.unenrollStudent(courseId, studentId),
    onSuccess: () => {
      refetchEnrolled();
    },
  });

  // Handlers
  const handleAddSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEditSubmit = (data: any) => {
    if (selectedCourse) {
      updateMutation.mutate({ id: selectedCourse.id, data });
    }
  };

  const handleOpenEdit = (course: Course) => {
    setSelectedCourse(course);
    setEditValue('code', course.code);
    setEditValue('name', course.name);
    setEditValue('description', course.description);
    setEditValue('credits', course.credits);
    setEditValue('teacherId', course.teacherId || '');
    setEditValue('departmentId', course.departmentId);
    setEditValue('semester', course.semester);
    setOpenEdit(true);
  };

  const handleOpenEnroll = (course: Course) => {
    setSelectedCourse(course);
    setOpenEnroll(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEnroll = () => {
    if (selectedCourse && enrollStudentId) {
      enrollMutation.mutate({ courseId: selectedCourse.id, studentId: Number(enrollStudentId) });
    }
  };

  const handleUnenroll = (studentId: number) => {
    if (selectedCourse && window.confirm('Remove student from course roster?')) {
      unenrollMutation.mutate({ courseId: selectedCourse.id, studentId });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Academics & Courses
        </Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
            Create Course
          </Button>
        )}
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert severity="error">Error loading academic course catalogs.</Alert>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>CODE</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>COURSE NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>CREDITS</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>DEPARTMENT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SEMESTER</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>FACULTY ASSIGNED</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseData?.content.map((course: Course) => (
                  <TableRow key={course.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>
                      <Chip label={`${course.credits} Credits`} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{course.departmentName}</TableCell>
                    <TableCell>Semester {course.semester}</TableCell>
                    <TableCell>{course.teacherName || 'Not Assigned'}</TableCell>
                    <TableCell align="right">
                      {(isAdmin || isTeacher) && (
                        <IconButton color="primary" onClick={() => handleOpenEnroll(course)} title="Manage Enrollments">
                          <EnrollIcon />
                        </IconButton>
                      )}
                      {isAdmin && (
                        <>
                          <IconButton color="warning" onClick={() => handleOpenEdit(course)} title="Edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(course.id)} title="Delete">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
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
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Course</DialogTitle>
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Course Code"
                  {...registerAdd('code', { required: 'Code is required' })}
                  error={!!errorsAdd.code}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  required
                  label="Course Name"
                  {...registerAdd('name', { required: 'Name is required' })}
                  error={!!errorsAdd.name}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Credits"
                  {...registerAdd('credits', { required: 'Credits required', valueAsNumber: true })}
                  error={!!errorsAdd.credits}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Department"
                  defaultValue=""
                  {...registerAdd('departmentId', { required: 'Department required' })}
                >
                  {deptData?.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Semester"
                  defaultValue={1}
                  {...registerAdd('semester', { required: 'Semester required' })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  select
                  label="Assign Instructor"
                  defaultValue=""
                  {...registerAdd('teacherId')}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {teacherData?.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Course Description" {...registerAdd('description')} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAdd(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmitAdd(handleAddSubmit)} variant="contained" disabled={createMutation.isPending}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Course Details</DialogTitle>
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
              <Grid item xs={12} sm={4}>
                <TextField fullWidth required label="Course Code" {...registerEdit('code', { required: 'Code is required' })} error={!!errorsEdit.code} />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth required label="Course Name" {...registerEdit('name', { required: 'Name is required' })} error={!!errorsEdit.name} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth required type="number" label="Credits" {...registerEdit('credits', { required: 'Credits required', valueAsNumber: true })} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth select label="Department" {...registerEdit('departmentId')}>
                  {deptData?.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth select label="Semester" {...registerEdit('semester')}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField fullWidth select label="Assign Instructor" {...registerEdit('teacherId')}>
                  <MenuItem value="">Unassigned</MenuItem>
                  {teacherData?.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Course Description" {...registerEdit('description')} />
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

      {/* Enrollments Dialog */}
      <Dialog open={openEnroll} onClose={() => setOpenEnroll(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Student Roster: {selectedCourse?.code}
        </DialogTitle>
        <DialogContent dividers>
          {(enrollMutation.isError || unenrollMutation.isError) && (
            <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
              {(enrollMutation.error as any)?.response?.data?.message || 
               (unenrollMutation.error as any)?.response?.data?.message || 
               'An error occurred during enrollment change.'}
            </Alert>
          )}
          {/* Enroll input */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 1 }}>
            <TextField
              fullWidth
              select
              label="Enroll Student"
              value={enrollStudentId}
              onChange={(e) => setEnrollStudentId(e.target.value)}
            >
              <MenuItem value="">Select Student...</MenuItem>
              {allStudentsData?.content
                .filter((student: Student) => !enrolledStudents?.some((e: Student) => e.id === student.id))
                .map((student: Student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.studentId})
                  </MenuItem>
                ))}
            </TextField>
            <Button
              variant="contained"
              startIcon={<EnrollIcon />}
              onClick={handleEnroll}
              disabled={!enrollStudentId || enrollMutation.isPending}
            >
              Enroll
            </Button>
          </Box>

          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5 }}>
            Currently Enrolled Students ({enrolledStudents?.length || 0})
          </Typography>
          <Divider />

          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {enrolledStudents?.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                No students enrolled in this course yet.
              </Typography>
            ) : (
              enrolledStudents?.map((student: Student) => (
                <ListItem key={student.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={`${student.firstName} ${student.lastName}`}
                    secondary={student.studentId}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleUnenroll(student.id)}
                      disabled={unenrollMutation.isPending}
                    >
                      <UnenrollIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEnroll(false)} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;
