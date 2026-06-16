import React from 'react';
import { Box } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';
import Navbar from '../components/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
