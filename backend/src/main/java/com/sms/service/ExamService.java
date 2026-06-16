package com.sms.service;

import com.sms.dto.*;
import java.util.List;

public interface ExamService {
    List<ExamResponse> getAllExams();
    ExamResponse getExamById(Long id);
    List<ExamResponse> getExamsByCourse(Long courseId);
    ExamResponse createExam(ExamRequest request);
    ExamResponse updateExam(Long id, ExamRequest request);
    void deleteExam(Long id);
}
