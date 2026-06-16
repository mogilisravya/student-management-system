import React from 'react';
import { Box, Container } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        {children}
      </Container>
    </Box>
  );
};

export default AuthLayout;
