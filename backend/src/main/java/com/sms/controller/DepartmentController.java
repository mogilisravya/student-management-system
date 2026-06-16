package com.sms.controller;

import com.sms.dto.DepartmentResponse;
import com.sms.mapper.DtoMapper;
import com.sms.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        List<DepartmentResponse> list = departmentRepository.findAll().stream()
                .map(DtoMapper::toDepartmentResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}
