package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.ResourceNotFoundException;
import com.sms.mapper.DtoMapper;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void markAttendanceBulk(AttendanceBulkRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        for (AttendanceRequest record : request.getRecords()) {
            Student student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + record.getStudentId()));

            Optional<Attendance> existingAttendance = attendanceRepository
                    .findByStudentIdAndCourseIdAndDate(student.getId(), course.getId(), request.getDate());

            Attendance attendance;
            if (existingAttendance.isPresent()) {
                attendance = existingAttendance.get();
                attendance.setStatus(record.getStatus());
                attendance.setRemarks(record.getRemarks());
            } else {
                attendance = Attendance.builder()
                        .student(student)
                        .course(course)
                        .date(request.getDate())
                        .status(record.getStatus())
                        .remarks(record.getRemarks())
                        .build();
            }
            attendanceRepository.save(attendance);
        }

        auditLogRepository.save(AuditLog.builder()
                .username("teacher")
                .action("MARK_ATTENDANCE")
                .details("Marked attendance for course: " + course.getCode() + " on " + request.getDate())
                .build());
    }

    @Override
    public List<AttendanceResponse> getAttendanceByCourseAndDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndDate(courseId, date).stream()
                .map(DtoMapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(DtoMapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudentAndCourse(Long studentId, Long courseId) {
        return attendanceRepository.findByStudentIdAndCourseId(studentId, courseId).stream()
                .map(DtoMapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }
}
