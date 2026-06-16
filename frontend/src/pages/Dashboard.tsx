import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Typography, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Chip } from '@mui/material';
import {
  People as StudentIcon,
  School as TeacherIcon,
  MenuBook as CourseIcon,
  CheckCircle as AttendanceIcon,
} from '@mui/icons-material';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'ROLE_STUDENT';

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Typography color="error">Error loading dashboard stats.</Typography>;
  if (!data) return <Typography>No data available.</Typography>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        University Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={data.totalStudents}
            icon={<StudentIcon />}
            color="primary"
            trend="+12% registered this sem"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Teachers"
            value={data.totalTeachers}
            icon={<TeacherIcon />}
            color="secondary"
            trend="+2 added this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Courses"
            value={data.totalCourses}
            icon={<CourseIcon />}
            color="warning"
            trend="12 core subjects"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance Rate"
            value={`${data.attendancePercentage}%`}
            icon={<AttendanceIcon />}
            color="success"
            trend="Avg. monthly index"
          />
        </Grid>
      </Grid>

      {/* Charts & Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={isStudent ? 12 : 7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Academic Subject Averages
              </Typography>
              <PerformanceChart data={data.performanceCharts} />
            </CardContent>
          </Card>
        </Grid>

        {!isStudent && (
          <Grid item xs={12} lg={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 0 }}>
                <Typography variant="h6" fontWeight={700} sx={{ p: 3, pb: 2 }}>
                  Recent Activities Log
                </Typography>
                <TableContainer sx={{ flexGrow: 1, maxHeight: 350 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>ACTION</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>DETAILS</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>OPERATOR</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recentActivities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No recent logs recorded.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.recentActivities.map((activity, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>
                              <Chip
                                label={activity.action}
                                size="small"
                                color={getActionChipColor(activity.action)}
                                sx={{ fontWeight: 700, fontSize: 10 }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: 'text.secondary' }}>
                              {activity.details}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                              {activity.username}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const getActionChipColor = (action: string) => {
  if (action.includes('CREATE') || action.includes('ENROLL') || action.includes('MARK')) return 'primary';
  if (action.includes('LOGIN') || action.includes('PASSWORD')) return 'info';
  if (action.includes('UPDATE')) return 'warning';
  if (action.includes('DELETE') || action.includes('UNENROLL')) return 'error';
  return 'default';
};

export default Dashboard;
