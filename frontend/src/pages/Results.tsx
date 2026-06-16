import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Alert
} from '@mui/material';
import { GetApp as DownloadIcon, CheckCircle as SaveIcon } from '@mui/icons-material';
import { courseService } from '../services/courseService';
import { examService } from '../services/examService';
import { studentService } from '../services/studentService';
import { resultService } from '../services/resultService';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Student, Exam, Result } from '../types';

const Results: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isStudent = user?.role === 'ROLE_STUDENT';

  // State for Teachers/Admins
  const [courseId, setCourseId] = useState<number | string>('');
  const [examId, setExamId] = useState<number | string>('');
  const [gradesSheet, setGradesSheet] = useState<{ [studentId: number]: { obtainedMarks: string; remarks: string } }>({});

  // Fetch courses (for dropdown)
  const { data: courses } = useQuery({
    queryKey: ['courses-list-results'],
    queryFn: () => courseService.getAll({ page: 0, size: 100 }),
    enabled: !isStudent,
  });

  // Fetch exams for selected course
  const { data: exams } = useQuery({
    queryKey: ['exams-results', courseId],
    queryFn: () => examService.getByCourse(Number(courseId)),
    enabled: !isStudent && !!courseId,
  });

  // Fetch enrolled students for course
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['enrolled-students-results', courseId],
    queryFn: () => courseService.getEnrolledStudents(Number(courseId)),
    enabled: !isStudent && !!courseId,
  });

  // Fetch existing results for exam
  const { data: existingResults, isLoading: loadingExistingResults } = useQuery({
    queryKey: ['results-by-exam', examId],
    queryFn: () => resultService.getByExam(Number(examId)),
    enabled: !isStudent && !!examId,
  });

  // Selected Exam object (to get total marks)
  const selectedExamObj = exams?.find(e => e.id === Number(examId));

  // Populate grades sheet
  useEffect(() => {
    if (!isStudent && students) {
      const sheet: typeof gradesSheet = {};
      students.forEach(student => {
        const existing = existingResults?.find(r => r.studentId === student.id);
        sheet[student.id] = {
          obtainedMarks: existing ? existing.obtainedMarks.toString() : '',
          remarks: existing ? (existing.remarks || '') : '',
        };
      });
      setGradesSheet(sheet);
    }
  }, [students, existingResults, isStudent]);

  // Mutations
  const assignMutation = useMutation({
    mutationFn: resultService.assignMarks,
    onSuccess: () => {
      alert('Grade saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['results-by-exam'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error saving grade');
    },
  });

  const handleMarksChange = (studentId: number, marks: string) => {
    setGradesSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        obtainedMarks: marks,
      },
    }));
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setGradesSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSaveStudentGrade = (studentId: number) => {
    if (!examId) return;
    const data = gradesSheet[studentId];
    if (!data.obtainedMarks) {
      alert('Please input obtained marks');
      return;
    }
    assignMutation.mutate({
      examId: Number(examId),
      studentId,
      obtainedMarks: Number(data.obtainedMarks),
      remarks: data.remarks,
    });
  };

  // ----------------------------------------------------
  // STUDENT PORTION
  // ----------------------------------------------------

  // Fetch Student Profile (to get ID)
  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile-results', user?.username],
    queryFn: () => studentService.getByUsername(user!.username),
    enabled: isStudent,
  });

  // Fetch Student Results
  const { data: studentResults, isLoading: loadingResults } = useQuery({
    queryKey: ['student-results', studentProfile?.id],
    queryFn: () => resultService.getByStudent(studentProfile!.id),
    enabled: isStudent && !!studentProfile,
  });

  // Fetch GPA
  const { data: studentGpa } = useQuery({
    queryKey: ['student-gpa', studentProfile?.id],
    queryFn: () => resultService.getGpa(studentProfile!.id),
    enabled: isStudent && !!studentProfile,
  });

  const handleDownloadReportCard = () => {
    if (studentProfile) {
      reportService.downloadReportCard(studentProfile.id);
    }
  };

  if (isStudent) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={800}>
            My Report Card
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReportCard}
          >
            Download Report Card PDF
          </Button>
        </Box>

        {loadingResults ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3}>
            {/* GPA Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                    CUMULATIVE GPA
                  </Typography>
                  <Typography variant="h2" fontWeight={800} sx={{ my: 1 }}>
                    {studentGpa || '0.0'}
                  </Typography>
                  <Typography variant="body2">
                    Calculated across all graded semesters
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Results Table */}
            <Grid item xs={12} md={8}>
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>SUBJECT</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>EXAM</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>OBTAINED MARKS</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>GRADE</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>REMARKS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentResults?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No exam results published yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        studentResults?.map((res: Result) => (
                          <TableRow key={res.id}>
                            <TableCell sx={{ fontWeight: 600 }}>{res.courseCode} - {res.courseName}</TableCell>
                            <TableCell>{res.examName}</TableCell>
                            <TableCell>{res.obtainedMarks} / {res.totalMarks}</TableCell>
                            <TableCell>
                              <Chip
                                label={res.grade}
                                size="small"
                                color={res.grade.startsWith('A') ? 'success' : res.grade.startsWith('B') ? 'primary' : 'warning'}
                                sx={{ fontWeight: 800 }}
                              />
                            </TableCell>
                            <TableCell color="text.secondary">{res.remarks || '-'}</TableCell>
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
        Grading Dashboard
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Course Catalog"
                value={courseId}
                onChange={(e) => { setCourseId(e.target.value); setExamId(''); }}
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
                select
                label="Select Scheduled Exam"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                disabled={!courseId}
              >
                <MenuItem value="">Choose Exam...</MenuItem>
                {exams?.map((e: Exam) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {!examId ? (
        <Alert severity="info">Please select a course and exam to open the student grades sheets.</Alert>
      ) : (loadingStudents || loadingExistingResults) ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>STUDENT ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>STUDENT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>OBTAINED / TOTAL MARKS</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>CALCULATED GRADE</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>REMARKS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No students enrolled in this course catalog.
                    </TableCell>
                  </TableRow>
                ) : (
                  students?.map((student: Student) => {
                    const sheetData = gradesSheet[student.id];
                    const marksNum = Number(sheetData?.obtainedMarks || 0);
                    const percent = selectedExamObj ? (marksNum / selectedExamObj.totalMarks) * 100 : 0;
                    
                    // Grade preview
                    let calculatedGrade = '-';
                    if (sheetData?.obtainedMarks) {
                      if (percent >= 90.0) calculatedGrade = 'A+';
                      else if (percent >= 80.0) calculatedGrade = 'A';
                      else if (percent >= 70.0) calculatedGrade = 'B';
                      else if (percent >= 60.0) calculatedGrade = 'C';
                      else if (percent >= 50.0) calculatedGrade = 'D';
                      else calculatedGrade = 'F';
                    }

                    return (
                      <TableRow key={student.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{student.studentId}</TableCell>
                        <TableCell>{student.firstName} {student.lastName}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            size="small"
                            type="number"
                            sx={{ width: 90 }}
                            value={sheetData?.obtainedMarks || ''}
                            onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          />
                          <Typography variant="body2">
                            / {selectedExamObj?.totalMarks}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {calculatedGrade !== '-' ? (
                            <Chip
                              label={calculatedGrade}
                              size="small"
                              color={calculatedGrade.startsWith('A') ? 'success' : calculatedGrade.startsWith('B') ? 'primary' : 'warning'}
                              sx={{ fontWeight: 800 }}
                            />
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            placeholder="Remarks"
                            value={sheetData?.remarks || ''}
                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<SaveIcon />}
                            onClick={() => handleSaveStudentGrade(student.id)}
                            disabled={assignMutation.isPending}
                          >
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
};

export default Results;
