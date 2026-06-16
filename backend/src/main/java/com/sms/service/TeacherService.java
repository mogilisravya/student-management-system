package com.sms.service;

import com.sms.dto.*;
import java.util.List;

public interface TeacherService {
    List<TeacherResponse> getAllTeachers();
    TeacherResponse getTeacherById(Long id);
    TeacherResponse getTeacherByUsername(String username);
    TeacherResponse createTeacher(TeacherRequest request);
    TeacherResponse updateTeacher(Long id, TeacherRequest request);
    void deleteTeacher(Long id);
}
