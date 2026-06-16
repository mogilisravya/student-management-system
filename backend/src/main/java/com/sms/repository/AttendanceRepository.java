package com.sms.repository;

import com.sms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByCourseId(Long courseId);
    List<Attendance> findByCourseIdAndDate(Long courseId, LocalDate date);
    Optional<Attendance> findByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);
    List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
    long countByStudentIdAndStatus(Long studentId, String status);
    long countByStudentId(Long studentId);
    long countByStatus(String status);
}
