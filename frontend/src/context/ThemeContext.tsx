import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleTheme = () => {
    setDarkMode((prev: boolean) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: darkMode ? '#60a5fa' : '#3b82f6',
        },
        secondary: {
          main: darkMode ? '#818cf8' : '#4f46e5',
        },
        background: {
          default: darkMode ? '#0f172a' : '#f8fafc',
          paper: darkMode ? '#1e293b' : '#ffffff',
        },
        text: {
          primary: darkMode ? '#f8fafc' : '#0f172a',
          secondary: darkMode ? '#94a3b8' : '#475569',
        },
        divider: darkMode ? '#334155' : '#e2e8f0',
      },
      typography: {
        fontFamily: 'Outfit, sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: darkMode 
                ? '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.3)' 
                : '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            },
          },
        },
      },
    });
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
};
