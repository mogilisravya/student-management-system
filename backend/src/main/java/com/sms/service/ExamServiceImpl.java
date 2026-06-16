package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.ResourceNotFoundException;
import com.sms.mapper.DtoMapper;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public List<ExamResponse> getAllExams() {
        return examRepository.findAll().stream()
                .map(DtoMapper::toExamResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ExamResponse getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        return DtoMapper.toExamResponse(exam);
    }

    @Override
    public List<ExamResponse> getExamsByCourse(Long courseId) {
        return examRepository.findByCourseId(courseId).stream()
                .map(DtoMapper::toExamResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExamResponse createExam(ExamRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        Exam exam = Exam.builder()
                .course(course)
                .name(request.getName())
                .examDate(request.getExamDate())
                .totalMarks(request.getTotalMarks())
                .build();

        Exam savedExam = examRepository.save(exam);

        auditLogRepository.save(AuditLog.builder()
                .username("teacher")
                .action("CREATE_EXAM")
                .details("Created exam: " + savedExam.getName() + " for Course: " + course.getCode())
                .build());

        return DtoMapper.toExamResponse(savedExam);
    }

    @Override
    @Transactional
    public ExamResponse updateExam(Long id, ExamRequest request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        exam.setCourse(course);
        exam.setName(request.getName());
        exam.setExamDate(request.getExamDate());
        exam.setTotalMarks(request.getTotalMarks());

        Exam updatedExam = examRepository.save(exam);

        auditLogRepository.save(AuditLog.builder()
                .username("teacher")
                .action("UPDATE_EXAM")
                .details("Updated exam: " + updatedExam.getName())
                .build());

        return DtoMapper.toExamResponse(updatedExam);
    }

    @Override
    @Transactional
    public void deleteExam(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));

        examRepository.delete(exam);

        auditLogRepository.save(AuditLog.builder()
                .username("teacher")
                .action("DELETE_EXAM")
                .details("Deleted exam: " + exam.getName())
                .build());
    }
}
