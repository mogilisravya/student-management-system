package com.sms.service;

public interface ReportService {
    byte[] generateStudentReportCSV();
    byte[] generateAttendanceReportCSV(Long courseId);
    byte[] generatePerformanceReportCSV(Long courseId);
    byte[] generateStudentReportCardTXT(Long studentId);
}
