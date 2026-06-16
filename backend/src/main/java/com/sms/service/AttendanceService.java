package com.sms.service;

import com.sms.dto.*;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    void markAttendanceBulk(AttendanceBulkRequest request);
    List<AttendanceResponse> getAttendanceByCourseAndDate(Long courseId, LocalDate date);
    List<AttendanceResponse> getAttendanceByStudent(Long studentId);
    List<AttendanceResponse> getAttendanceByStudentAndCourse(Long studentId, Long courseId);
}
