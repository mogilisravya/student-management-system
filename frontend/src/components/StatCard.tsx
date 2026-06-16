import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              {value}
            </Typography>
            {trend && (
              <Typography variant="caption" color="success.main" fontWeight={600}>
                {trend}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              width: 56,
              height: 56,
              fontSize: '1.75rem',
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
