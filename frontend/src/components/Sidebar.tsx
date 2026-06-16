import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider, Avatar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as CourseIcon,
  CheckCircle as AttendanceIcon,
  Assignment as ExamIcon,
  Grade as GradeIcon,
  Assessment as ReportIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const role = user?.role || 'ROLE_STUDENT';
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    if (role === 'ROLE_ADMIN') {
      return [
        ...baseItems,
        { text: 'Students', icon: <PeopleIcon />, path: '/students' },
        { text: 'Teachers', icon: <SchoolIcon />, path: '/teachers' },
        { text: 'Courses', icon: <CourseIcon />, path: '/courses' },
        { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
        { text: 'Exams', icon: <ExamIcon />, path: '/exams' },
        { text: 'Results', icon: <GradeIcon />, path: '/results' },
        { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
      ];
    }

    if (role === 'ROLE_TEACHER') {
      return [
        ...baseItems,
        { text: 'Students', icon: <PeopleIcon />, path: '/students' },
        { text: 'Courses', icon: <CourseIcon />, path: '/courses' },
        { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
        { text: 'Exams', icon: <ExamIcon />, path: '/exams' },
        { text: 'Results', icon: <GradeIcon />, path: '/results' },
        { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
      ];
    }

    // STUDENT
    return [
      ...baseItems,
      { text: 'My Courses', icon: <CourseIcon />, path: '/courses' },
      { text: 'My Attendance', icon: <AttendanceIcon />, path: '/attendance' },
      { text: 'My Results', icon: <ResultsIconWrapper />, path: '/results' },
      { text: 'My Profile', icon: <ProfileIcon />, path: '/profile' },
    ];
  };

  const ResultsIconWrapper = () => <GradeIcon />;

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
          SMS PORTAL
        </Typography>
      </Box>
      <Divider />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
        <Avatar
          sx={{
            width: 72,
            height: 72,
            mb: 1.5,
            bgcolor: 'primary.main',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {user?.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={700}>
          {user?.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role.replace('ROLE_', '')}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      <Box sx={{ overflow: 'auto', flex: 1, px: 1.5 }}>
        <List>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.25,
                  color: active ? 'primary.main' : 'text.primary',
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': { bgcolor: 'error.light', color: 'error.dark' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
