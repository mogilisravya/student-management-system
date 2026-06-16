package com.sms.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private double attendancePercentage;
    private List<RecentActivityDto> recentActivities;
    private List<PerformanceDataDto> performanceCharts;
}
