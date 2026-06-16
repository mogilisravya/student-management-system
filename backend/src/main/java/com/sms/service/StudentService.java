package com.sms.service;

import com.sms.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface StudentService {
    Page<StudentResponse> getAllStudents(String search, Long departmentId, Integer semester, Pageable pageable);
    StudentResponse getStudentById(Long id);
    StudentResponse getStudentByUsername(String username);
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentRequest request);
    void deleteStudent(Long id);
    StudentResponse uploadPhoto(Long id, MultipartFile file);
}
