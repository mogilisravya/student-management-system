package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.mapper.DtoMapper;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResultServiceImpl implements ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public ResultResponse assignMarks(ResultRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + request.getExamId()));
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        if (request.getObtainedMarks() > exam.getTotalMarks()) {
            throw new BadRequestException("Obtained marks (" + request.getObtainedMarks() + 
                    ") cannot exceed total exam marks (" + exam.getTotalMarks() + ")");
        }

        double percentage = (request.getObtainedMarks() / exam.getTotalMarks()) * 100;
        String grade = calculateGrade(percentage);

        Optional<Result> existingResult = resultRepository.findByExamIdAndStudentId(exam.getId(), student.getId());

        Result result;
        if (existingResult.isPresent()) {
            result = existingResult.get();
            result.setObtainedMarks(request.getObtainedMarks());
            result.setGrade(grade);
            result.setRemarks(request.getRemarks());
        } else {
            result = Result.builder()
                    .exam(exam)
                    .student(student)
                    .obtainedMarks(request.getObtainedMarks())
                    .grade(grade)
                    .remarks(request.getRemarks())
                    .build();
        }

        Result savedResult = resultRepository.save(result);

        auditLogRepository.save(AuditLog.builder()
                .username("teacher")
                .action("ASSIGN_MARKS")
                .details("Assigned grade " + grade + " to Student ID: " + student.getStudentId() + " for Exam: " + exam.getName())
                .build());

        return DtoMapper.toResultResponse(savedResult);
    }

    @Override
    public List<ResultResponse> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId).stream()
                .map(DtoMapper::toResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResultResponse> getResultsByExam(Long examId) {
        return resultRepository.findByExamId(examId).stream()
                .map(DtoMapper::toResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Double calculateStudentGpa(Long studentId) {
        List<Result> results = resultRepository.findByStudentId(studentId);
        if (results.isEmpty()) {
            return 0.0;
        }

        double totalGradePoints = 0.0;
        int totalCredits = 0;

        for (Result result : results) {
            Course course = result.getExam().getCourse();
            int credits = course.getCredits();
            double gradePoints = getGradePoints(result.getGrade());

            totalGradePoints += (gradePoints * credits);
            totalCredits += credits;
        }

        if (totalCredits == 0) return 0.0;

        double gpa = totalGradePoints / totalCredits;
        return Math.round(gpa * 100.0) / 100.0; // Round to 2 decimal places
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90.0) return "A+";
        if (percentage >= 80.0) return "A";
        if (percentage >= 70.0) return "B";
        if (percentage >= 60.0) return "C";
        if (percentage >= 50.0) return "D";
        return "F";
    }

    private double getGradePoints(String grade) {
        return switch (grade) {
            case "A+" -> 4.0;
            case "A" -> 3.75;
            case "B" -> 3.0;
            case "C" -> 2.0;
            case "D" -> 1.0;
            default -> 0.0; // F
        };
    }
}
