import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem, Button, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody, RadioGroup, FormControlLabel, Radio,
  Alert, Chip, TablePagination
} from '@mui/material';
import { CheckCircle as CheckIcon, Cancel as CancelIcon, Warning as LateIcon } from '@mui/icons-material';
import { courseService } from '../services/courseService';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Student, Attendance } from '../types';

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isStudent = user?.role === 'ROLE_STUDENT';

  // State for Teachers/Admins
  const [courseId, setCourseId] = useState<number | string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceSheet, setAttendanceSheet] = useState<{ [studentId: number]: { status: string; remarks: string } }>({});

  // Fetch courses (for dropdown)
  const { data: courses } = useQuery({
    queryKey: ['courses-list'],
    queryFn: () => courseService.getAll({ page: 0, size: 100 }),
    enabled: !isStudent,
  });

  // Fetch enrolled students for selected course
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['enrolled-students', courseId],
    queryFn: () => courseService.getEnrolledStudents(Number(courseId)),
    enabled: !isStudent && !!courseId,
  });

  // Fetch existing attendance for course and date
  const { data: existingAttendance, isLoading: loadingExisting } = useQuery({
    queryKey: ['attendance', courseId, date],
    queryFn: () => attendanceService.getByCourseAndDate(Number(courseId), date),
    enabled: !isStudent && !!courseId && !!date,
  });

  // Populate sheet when student lists or existing attendance records are loaded
  useEffect(() => {
    if (!isStudent && students) {
      const sheet: typeof attendanceSheet = {};
      students.forEach(student => {
        const existing = existingAttendance?.find(a => a.studentId === student.id);
        sheet[student.id] = {
          status: existing ? existing.status : 'PRESENT',
          remarks: existing ? (existing.remarks || '') : '',
        };
      });
      setAttendanceSheet(sheet);
    }
  }, [students, existingAttendance, isStudent]);

  // Mutations
  const markBulkMutation = useMutation({
    mutationFn: attendanceService.markBulk,
    onSuccess: () => {
      alert('Attendance saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSaveSheet = () => {
    if (!courseId) return;
    const records = Object.entries(attendanceSheet).map(([studentId, data]) => ({
      studentId: Number(studentId),
      status: data.status,
      remarks: data.remarks,
    }));
    markBulkMutation.mutate({
      courseId: Number(courseId),
      date,
      records,
    });
  };

  // ----------------------------------------------------
  // STUDENT PORTION
  // ----------------------------------------------------

  // Fetch Student Profile (to get student ID)
  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', user?.username],
    queryFn: () => studentService.getByUsername(user!.username),
    enabled: isStudent,
  });

  // Fetch Student Attendance History
  const { data: attendanceHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['student-attendance', studentProfile?.id],
    queryFn: () => attendanceService.getByStudent(studentProfile!.id),
    enabled: isStudent && !!studentProfile,
  });

  // Calculate rate
  const getStudentStats = () => {
    if (!attendanceHistory || attendanceHistory.length === 0) return { present: 0, total: 0, rate: 0 };
    const present = attendanceHistory.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const rate = Math.round((present / attendanceHistory.length) * 100);
    return { present, total: attendanceHistory.length, rate };
  };

  const stats = getStudentStats();

  if (isStudent) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
          My Attendance Log
        </Typography>

        {loadingHistory ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3}>
            {/* Stat Cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                    ATTENDANCE RATING
                  </Typography>
                  <Typography variant="h2" fontWeight={800} sx={{ my: 1 }}>
                    {stats.rate}%
                  </Typography>
                  <Typography variant="body2">
                    {stats.present} present out of {stats.total} total classes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Table */}
            <Grid item xs={12} md={8}>
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>DATE</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>COURSE</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>REMARKS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceHistory?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No attendance history logged.
                          </TableCell>
                        </TableRow>
                      ) : (
                        attendanceHistory?.map((att: Attendance) => (
                          <TableRow key={att.id}>
                            <TableCell sx={{ fontWeight: 600 }}>{att.date}</TableCell>
                            <TableCell>{att.courseCode} - {att.courseName}</TableCell>
                            <TableCell>
                              <Chip
                                label={att.status}
                                size="small"
                                color={
                                  att.status === 'PRESENT' ? 'success' :
                                  att.status === 'ABSENT' ? 'error' :
                                  att.status === 'LATE' ? 'warning' : 'default'
                                }
                                icon={
                                  att.status === 'PRESENT' ? <CheckIcon /> :
                                  att.status === 'ABSENT' ? <CancelIcon /> :
                                  att.status === 'LATE' ? <LateIcon /> : undefined
                                }
                                sx={{ fontWeight: 700, fontSize: 11 }}
                              />
                            </TableCell>
                            <TableCell color="text.secondary">{att.remarks || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }

  // ----------------------------------------------------
  // ADMIN/TEACHER PORTION
  // ----------------------------------------------------
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        Attendance Console
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Course Catalog"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <MenuItem value="">Choose Course...</MenuItem>
                {courses?.content.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {!courseId ? (
        <Alert severity="info">Please select a course to load the student registry.</Alert>
      ) : (loadingStudents || loadingExisting) ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>STUDENT ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>STUDENT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>ATTENDANCE STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>REMARKS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No students enrolled in this course.
                    </TableCell>
                  </TableRow>
                ) : (
                  students?.map((student: Student) => (
                    <TableRow key={student.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{student.studentId}</TableCell>
                      <TableCell>{student.firstName} {student.lastName}</TableCell>
                      <TableCell>
                        <RadioGroup
                          row
                          value={attendanceSheet[student.id]?.status || 'PRESENT'}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        >
                          <FormControlLabel value="PRESENT" control={<Radio color="success" />} label="Present" />
                          <FormControlLabel value="ABSENT" control={<Radio color="error" />} label="Absent" />
                          <FormControlLabel value="LATE" control={<Radio color="warning" />} label="Late" />
                          <FormControlLabel value="EXCUSED" control={<Radio color="primary" />} label="Excused" />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="Remarks"
                          value={attendanceSheet[student.id]?.remarks || ''}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {students && students.length > 0 && (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                onClick={handleSaveSheet}
                disabled={markBulkMutation.isPending}
                size="large"
                sx={{ px: 4 }}
              >
                Save Attendance Sheet
              </Button>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
};

export default AttendancePage;
