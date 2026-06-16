import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Button, TextField, MenuItem, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, TablePagination, Card, CardContent, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Drawer, Divider, Avatar,
  InputAdornment, Alert
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon,
  Search as SearchIcon, PhotoCamera as CameraIcon
} from '@mui/icons-material';
import { studentService } from '../services/studentService';
import { departmentService } from '../services/departmentService';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { Student } from '../types';

const Students: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<number | string>('');
  const [semFilter, setSemFilter] = useState<number | string>('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog & Drawer State
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Form hooks
  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue: setEditValue, formState: { errors: errorsEdit } } = useForm();

  // Queries
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const { data: studentData, isLoading, error } = useQuery({
    queryKey: ['students', search, deptFilter, semFilter, page, rowsPerPage],
    queryFn: () => studentService.getAll({
      search,
      departmentId: deptFilter ? Number(deptFilter) : undefined,
      semester: semFilter ? Number(semFilter) : undefined,
      page,
      size: rowsPerPage,
    }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setOpenAdd(false);
      resetAdd();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setOpenEdit(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => studentService.uploadPhoto(id, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setSelectedStudent(data);
    },
  });

  // Handlers
  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEditSubmit = (data: any) => {
    if (selectedStudent) {
      updateMutation.mutate({ id: selectedStudent.id, data });
    }
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditValue('studentId', student.studentId);
    setEditValue('firstName', student.firstName);
    setEditValue('lastName', student.lastName);
    setEditValue('gender', student.gender);
    setEditValue('dateOfBirth', student.dateOfBirth);
    setEditValue('email', student.email);
    setEditValue('mobileNumber', student.mobileNumber);
    setEditValue('address', student.address);
    setEditValue('parentName', student.parentName);
    setEditValue('parentContact', student.parentContact);
    setEditValue('admissionDate', student.admissionDate);
    setEditValue('departmentId', student.departmentId);
    setEditValue('semester', student.semester);
    setOpenEdit(true);
  };

  const handleOpenDrawer = (student: Student) => {
    setSelectedStudent(student);
    setOpenDrawer(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this student and their login account?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedStudent && e.target.files && e.target.files[0]) {
      uploadPhotoMutation.mutate({ id: selectedStudent.id, file: e.target.files[0] });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Student Directory
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
          Register Student
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search Students"
                placeholder="Name or Student ID"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Filter by Department"
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setPage(0); }}
              >
                <MenuItem value="">All Departments</MenuItem>
                {deptData?.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Filter by Semester"
                value={semFilter}
                onChange={(e) => { setSemFilter(e.target.value); setPage(0); }}
              >
                <MenuItem value="">All Semesters</MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert severity="error">Error loading student directories.</Alert>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>STUDENT ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>EMAIL</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>DEPARTMENT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SEMESTER</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData?.content.map((stu: Student) => (
                  <TableRow key={stu.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{stu.studentId}</TableCell>
                    <TableCell>{stu.firstName} {stu.lastName}</TableCell>
                    <TableCell>{stu.email}</TableCell>
                    <TableCell>{stu.departmentName}</TableCell>
                    <TableCell>Semester {stu.semester}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDrawer(stu)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="warning" onClick={() => handleOpenEdit(stu)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(stu.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={studentData?.totalElements || 0}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Register New Student</DialogTitle>
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
                  label="Student ID"
                  {...registerAdd('studentId', { required: 'Student ID is required' })}
                  error={!!errorsAdd.studentId}
                  helperText={errorsAdd.studentId?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  {...registerAdd('firstName', { required: 'First Name is required' })}
                  error={!!errorsAdd.firstName}
                  helperText={errorsAdd.firstName?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  {...registerAdd('lastName', { required: 'Last Name is required' })}
                  error={!!errorsAdd.lastName}
                  helperText={errorsAdd.lastName?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Gender"
                  defaultValue="MALE"
                  {...registerAdd('gender', { required: 'Gender is required' })}
                >
                  <MenuItem value="MALE">MALE</MenuItem>
                  <MenuItem value="FEMALE">FEMALE</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...registerAdd('dateOfBirth', { required: 'DOB is required' })}
                  error={!!errorsAdd.dateOfBirth}
                  helperText={errorsAdd.dateOfBirth?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  {...registerAdd('email', { required: 'Email is required' })}
                  error={!!errorsAdd.email}
                  helperText={errorsAdd.email?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Mobile" {...registerAdd('mobileNumber')} />
              </Grid>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Semester"
                  defaultValue={1}
                  {...registerAdd('semester', { required: 'Semester is required' })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parent Name" {...registerAdd('parentName')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parent Contact" {...registerAdd('parentContact')} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Admission Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...registerAdd('admissionDate', { required: 'Admission Date is required' })}
                  error={!!errorsAdd.admissionDate}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth label="Address" {...registerAdd('address')} />
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
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Student Details</DialogTitle>
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
                <TextField fullWidth disabled label="Student ID" {...registerEdit('studentId')} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  {...registerEdit('firstName', { required: 'First Name is required' })}
                  error={!!errorsEdit.firstName}
                  helperText={errorsEdit.firstName?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  {...registerEdit('lastName', { required: 'Last Name is required' })}
                  error={!!errorsEdit.lastName}
                  helperText={errorsEdit.lastName?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth select label="Gender" {...registerEdit('gender')}>
                  <MenuItem value="MALE">MALE</MenuItem>
                  <MenuItem value="FEMALE">FEMALE</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...registerEdit('dateOfBirth')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth required label="Email" {...registerEdit('email')} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Mobile" {...registerEdit('mobileNumber')} />
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
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parent Name" {...registerEdit('parentName')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Parent Contact" {...registerEdit('parentContact')} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth required label="Admission Date" type="date" InputLabelProps={{ shrink: true }} {...registerEdit('admissionDate')} />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth label="Address" {...registerEdit('address')} />
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

      {/* Details Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 380, p: 4 }}>
          {selectedStudent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={selectedStudent.profilePhoto}
                  sx={{ width: 120, height: 120, border: '4px solid #3b82f6', fontSize: 36, fontWeight: 700 }}
                >
                  {selectedStudent.firstName.charAt(0)}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute', bottom: 0, right: 0,
                    bgcolor: 'primary.main', color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <CameraIcon />
                  <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                </IconButton>
              </Box>

              <Typography variant="h5" fontWeight={800}>
                {selectedStudent.firstName} {selectedStudent.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedStudent.studentId}
              </Typography>
              <Divider sx={{ width: '100%', mb: 3 }} />

              <Grid container spacing={2} sx={{ textAlign: 'left', mb: 2 }}>
                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Email</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.email}</Typography></Grid>
                
                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Phone</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.mobileNumber || 'N/A'}</Typography></Grid>
                
                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Gender</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.gender}</Typography></Grid>

                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>DOB</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.dateOfBirth}</Typography></Grid>

                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Department</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.departmentName}</Typography></Grid>

                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Semester</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">Semester {selectedStudent.semester}</Typography></Grid>

                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Parent</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.parentName || 'N/A'}</Typography></Grid>

                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Parent Call</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.parentContact || 'N/A'}</Typography></Grid>

                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Address</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.address || 'N/A'}</Typography></Grid>

                <Grid item xs={5}><Typography variant="body2" fontWeight={700}>Admission</Typography></Grid>
                <Grid item xs={7}><Typography variant="body2" color="text.secondary">{selectedStudent.admissionDate}</Typography></Grid>
              </Grid>
              <Divider sx={{ width: '100%', my: 2 }} />
              <Button fullWidth variant="outlined" color="primary" onClick={() => setOpenDrawer(false)} sx={{ mt: 2 }}>
                Close Summary
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Students;
