package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Override
    public DashboardStats getDashboardStats() {
        long studentCount = studentRepository.count();
        long teacherCount = teacherRepository.count();
        long courseCount = courseRepository.count();

        // Calculate overall attendance rate
        long totalAttendance = attendanceRepository.count();
        double attendancePercentage = 0.0;
        if (totalAttendance > 0) {
            long presentCount = attendanceRepository.countByStatus("PRESENT") + 
                                attendanceRepository.countByStatus("LATE");
            attendancePercentage = ((double) presentCount / totalAttendance) * 100;
            attendancePercentage = Math.round(attendancePercentage * 100.0) / 100.0;
        }

        // Fetch recent activities (Audit Logs limit 10)
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();
        List<RecentActivityDto> recentActivities = logs.stream()
                .limit(10)
                .map(log -> RecentActivityDto.builder()
                        .action(log.getAction())
                        .details(log.getDetails())
                        .timestamp(log.getTimestamp())
                        .username(log.getUsername())
                        .build())
                .collect(Collectors.toList());

        // Fetch course performance data (average normalized to percentage)
        List<Course> courses = courseRepository.findAll();
        List<PerformanceDataDto> performanceCharts = courses.stream()
                .map(course -> {
                    List<Exam> exams = examRepository.findByCourseId(course.getId());
                    double totalScore = 0.0;
                    int resultCount = 0;
                    for (Exam exam : exams) {
                        List<Result> results = resultRepository.findByExamId(exam.getId());
                        for (Result r : results) {
                            totalScore += (r.getObtainedMarks() / exam.getTotalMarks()) * 100;
                            resultCount++;
                        }
                    }
                    double averageScore = resultCount == 0 ? 0.0 : (totalScore / resultCount);
                    return PerformanceDataDto.builder()
                            .subject(course.getCode())
                            .averageMarks(Math.round(averageScore * 100.0) / 100.0)
                            .build();
                })
                .collect(Collectors.toList());

        return DashboardStats.builder()
                .totalStudents(studentCount)
                .totalTeachers(teacherCount)
                .totalCourses(courseCount)
                .attendancePercentage(attendancePercentage)
                .recentActivities(recentActivities)
                .performanceCharts(performanceCharts)
                .build();
    }
}
