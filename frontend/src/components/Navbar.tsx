import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Box, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleCloseNotifMenu = () => {
    setAnchorElNotif(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateProfile = () => {
    navigate('/profile');
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ px: 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Portal Console
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme} color="inherit">
              {darkMode ? <LightIcon /> : <DarkIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleOpenNotifMenu}>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorElNotif}
            open={Boolean(anchorElNotif)}
            onClose={handleCloseNotifMenu}
            PaperProps={{ sx: { width: 320, mt: 1.5, borderRadius: 2 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle2" fontWeight={800}>
                Recent Alerts
              </Typography>
            </Box>
            <MenuItem onClick={handleCloseNotifMenu} sx={{ py: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
              <Typography variant="body2" fontWeight={700}>Welcome to the University Portal</Typography>
              <Typography variant="caption" color="text.secondary">Explore courses, track classes, and check grades.</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNotifMenu} sx={{ py: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
              <Typography variant="body2" fontWeight={700}>System initialized</Typography>
              <Typography variant="caption" color="text.secondary">All systems are running correctly.</Typography>
            </MenuItem>
          </Menu>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="User actions">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{ sx: { width: 180, mt: 1.5, borderRadius: 2 } }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleNavigateProfile} sx={{ py: 1.25 }}>
                <ProfileIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600}>My Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600}>Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
