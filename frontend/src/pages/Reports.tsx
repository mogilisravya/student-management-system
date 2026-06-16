import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Typography, Grid, Card, CardContent, TextField, MenuItem, Button, Alert
} from '@mui/material';
import {
  People as StudentIcon,
  CheckCircle as AttendanceIcon,
  Assessment as PerformanceIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { courseService } from '../services/courseService';
import { reportService } from '../services/reportService';

const Reports: React.FC = () => {
  const [attendanceCourseId, setAttendanceCourseId] = useState<number | string>('');
  const [performanceCourseId, setPerformanceCourseId] = useState<number | string>('');

  const { data: courses } = useQuery({
    queryKey: ['courses-reports'],
    queryFn: () => courseService.getAll({ page: 0, size: 100 }),
  });

  const handleExportStudents = () => {
    reportService.exportStudents();
  };

  const handleExportAttendance = () => {
    if (attendanceCourseId) {
      reportService.exportAttendance(Number(attendanceCourseId));
    }
  };

  const handleExportPerformance = () => {
    if (performanceCourseId) {
      reportService.exportPerformance(Number(performanceCourseId));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        Management Reports
      </Typography>

      <Grid container spacing={3}>
        {/* Student Report */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: 'primary.light', color: 'primary.main',
                    width: 56, height: 56, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <StudentIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Students Directory
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Export a comprehensive list of all registered students including system IDs, contact information, parent details, and departments.
              </Typography>
            </CardContent>
            <Box sx={{ p: 3, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportStudents}
              >
                Export CSV Roster
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Attendance Report */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: 'success.light', color: 'success.main',
                    width: 56, height: 56, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <AttendanceIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Attendance Logs
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Export overall class attendance records for a specific course catalog. Select a course code below to download.
              </Typography>
              <TextField
                fullWidth
                select
                label="Select Course"
                value={attendanceCourseId}
                onChange={(e) => setAttendanceCourseId(e.target.value)}
                sx={{ mb: 1 }}
              >
                <MenuItem value="">Choose Course...</MenuItem>
                {courses?.content.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
            <Box sx={{ p: 3, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={handleExportAttendance}
                disabled={!attendanceCourseId}
              >
                Export CSV Logs
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Performance Report */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: 'warning.light', color: 'warning.main',
                    width: 56, height: 56, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <PerformanceIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Performance Summary
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Export examination results, grades, and average student marks for a course catalog. Select a course below to download.
              </Typography>
              <TextField
                fullWidth
                select
                label="Select Course"
                value={performanceCourseId}
                onChange={(e) => setPerformanceCourseId(e.target.value)}
                sx={{ mb: 1 }}
              >
                <MenuItem value="">Choose Course...</MenuItem>
                {courses?.content.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
            <Box sx={{ p: 3, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<DownloadIcon />}
                onClick={handleExportPerformance}
                disabled={!performanceCourseId}
              >
                Export CSV Performance
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
