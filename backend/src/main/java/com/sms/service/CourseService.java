package com.sms.service;

import com.sms.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CourseService {
    Page<CourseResponse> getAllCourses(String search, Long departmentId, Pageable pageable);
    CourseResponse getCourseById(Long id);
    CourseResponse createCourse(CourseRequest request);
    CourseResponse updateCourse(Long id, CourseRequest request);
    void deleteCourse(Long id);
    void enrollStudent(Long courseId, Long studentId);
    void unenrollStudent(Long courseId, Long studentId);
    List<StudentResponse> getEnrolledStudents(Long courseId);
    List<CourseResponse> getCoursesByStudent(Long studentId);
    List<CourseResponse> getCoursesByTeacher(Long teacherId);
}
