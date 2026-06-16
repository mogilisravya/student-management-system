package com.sms.controller;

import com.sms.dto.*;
import com.sms.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ResultResponse> assignMarks(@Valid @RequestBody ResultRequest request) {
        return ResponseEntity.ok(resultService.assignMarks(request));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ResultResponse>> getResultsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<ResultResponse>> getResultsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.getResultsByExam(examId));
    }

    @GetMapping("/student/{studentId}/gpa")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Double> getStudentGpa(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.calculateStudentGpa(studentId));
    }
}
