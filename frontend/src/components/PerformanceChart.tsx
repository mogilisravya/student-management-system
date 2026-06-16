import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PerformanceData } from '../types';
import { useTheme } from '@mui/material';

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis
          dataKey="subject"
          stroke={theme.palette.text.secondary}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 600 }}
        />
        <YAxis
          stroke={theme.palette.text.secondary}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 600 }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          }}
        />
        <Legend />
        <Bar
          name="Average Performance (%)"
          dataKey="averageMarks"
          fill={theme.palette.primary.main}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
