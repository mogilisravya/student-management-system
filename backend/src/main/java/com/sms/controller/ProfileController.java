package com.sms.controller;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.*;
import com.sms.service.AuthService;
import com.sms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName());

        if (user.getRole().getName().equals("ROLE_STUDENT")) {
            Student student = studentRepository.findByUser_Username(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
            builder.studentId(student.getStudentId())
                    .firstName(student.getFirstName())
                    .lastName(student.getLastName())
                    .gender(student.getGender())
                    .dateOfBirth(student.getDateOfBirth())
                    .mobileNumber(student.getMobileNumber())
                    .address(student.getAddress())
                    .parentName(student.getParentName())
                    .parentContact(student.getParentContact())
                    .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : null)
                    .semester(student.getSemester())
                    .profilePhoto(student.getProfilePhoto());
        } else if (user.getRole().getName().equals("ROLE_TEACHER")) {
            Teacher teacher = teacherRepository.findByUser_Username(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));
            builder.employeeId(teacher.getEmployeeId())
                    .teacherName(teacher.getName())
                    .phone(teacher.getPhone())
                    .qualification(teacher.getQualification())
                    .experience(teacher.getExperience())
                    .departmentName(teacher.getDepartment() != null ? teacher.getDepartment().getName() : null);
        }

        return ResponseEntity.ok(builder.build());
    }

    @PutMapping
    public ResponseEntity<Void> updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already taken: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
            userRepository.save(user);
        }

        if (user.getRole().getName().equals("ROLE_STUDENT")) {
            Student student = studentRepository.findByUser_Username(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                student.setEmail(request.getEmail());
            }
            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                if (!request.getPhone().equals(student.getMobileNumber())) {
                    if (studentRepository.existsByMobileNumber(request.getPhone())) {
                        throw new BadRequestException("Mobile number already taken: " + request.getPhone());
                    }
                }
                student.setMobileNumber(request.getPhone());
            } else if (request.getPhone() != null) {
                student.setMobileNumber(null);
            }
            if (request.getAddress() != null) {
                student.setAddress(request.getAddress());
            }
            studentRepository.save(student);
        } else if (user.getRole().getName().equals("ROLE_TEACHER")) {
            Teacher teacher = teacherRepository.findByUser_Username(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                teacher.setEmail(request.getEmail());
            }
            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                if (!request.getPhone().equals(teacher.getPhone())) {
                    if (teacherRepository.existsByPhone(request.getPhone())) {
                        throw new BadRequestException("Phone number already taken: " + request.getPhone());
                    }
                }
                teacher.setPhone(request.getPhone());
            } else if (request.getPhone() != null) {
                teacher.setPhone(null);
            }
            teacherRepository.save(teacher);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok("Password updated successfully.");
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<StudentResponse> uploadPhoto(Authentication authentication, @RequestParam("file") MultipartFile file) {
        String username = authentication.getName();
        Student student = studentRepository.findByUser_Username(username)
                .orElseThrow(() -> new BadRequestException("Only students have profile photo upload configurations."));
        return ResponseEntity.ok(studentService.uploadPhoto(student.getId(), file));
    }
}
