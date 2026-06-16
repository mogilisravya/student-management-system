package com.sms.service;

import com.sms.dto.*;
import java.util.List;

public interface ResultService {
    ResultResponse assignMarks(ResultRequest request);
    List<ResultResponse> getResultsByStudent(Long studentId);
    List<ResultResponse> getResultsByExam(Long examId);
    Double calculateStudentGpa(Long studentId);
}
