package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.mapper.DtoMapper;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public Page<StudentResponse> getAllStudents(String search, Long departmentId, Integer semester, Pageable pageable) {
        String querySearch = (search == null || search.trim().isEmpty()) ? null : search.trim();
        Page<Student> students = studentRepository.findStudentsFiltered(querySearch, departmentId, semester, pageable);
        return students.map(DtoMapper::toStudentResponse);
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return DtoMapper.toStudentResponse(student);
    }

    @Override
    public StudentResponse getStudentByUsername(String username) {
        Student student = studentRepository.findByUser_Username(username)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with username: " + username));
        return DtoMapper.toStudentResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new BadRequestException("Student ID already exists: " + request.getStudentId());
        }
        if (studentRepository.existsByEmail(request.getEmail()) || userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }
        if (request.getMobileNumber() != null && !request.getMobileNumber().trim().isEmpty()) {
            if (studentRepository.existsByMobileNumber(request.getMobileNumber())) {
                throw new BadRequestException("Mobile number already exists: " + request.getMobileNumber());
            }
        }
        if (userRepository.existsByUsername(request.getStudentId())) {
            throw new BadRequestException("Username already exists: " + request.getStudentId());
        }

        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_STUDENT not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        // Create user
        User user = User.builder()
                .username(request.getStudentId())
                .password(passwordEncoder.encode("password")) // default password
                .email(request.getEmail())
                .role(studentRole)
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);

        // Create student
        Student student = Student.builder()
                .user(savedUser)
                .studentId(request.getStudentId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .address(request.getAddress())
                .parentName(request.getParentName())
                .parentContact(request.getParentContact())
                .admissionDate(request.getAdmissionDate())
                .department(department)
                .semester(request.getSemester())
                .build();
        Student savedStudent = studentRepository.save(student);

        // Audit Log
        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("CREATE_STUDENT")
                .details("Registered student: " + savedStudent.getFirstName() + " " + savedStudent.getLastName() + " (" + savedStudent.getStudentId() + ")")
                .build());

        return DtoMapper.toStudentResponse(savedStudent);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (!student.getEmail().equals(request.getEmail())) {
            if (studentRepository.existsByEmail(request.getEmail()) || userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists: " + request.getEmail());
            }
        }

        if (request.getMobileNumber() != null && !request.getMobileNumber().trim().isEmpty()) {
            if (!request.getMobileNumber().equals(student.getMobileNumber())) {
                if (studentRepository.existsByMobileNumber(request.getMobileNumber())) {
                    throw new BadRequestException("Mobile number already exists: " + request.getMobileNumber());
                }
            }
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        // Update User fields
        User user = student.getUser();
        user.setEmail(request.getEmail());
        userRepository.save(user);

        // Update Student fields
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setGender(request.getGender());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setEmail(request.getEmail());
        student.setMobileNumber(request.getMobileNumber());
        student.setAddress(request.getAddress());
        student.setParentName(request.getParentName());
        student.setParentContact(request.getParentContact());
        student.setAdmissionDate(request.getAdmissionDate());
        student.setDepartment(department);
        student.setSemester(request.getSemester());

        Student updatedStudent = studentRepository.save(student);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("UPDATE_STUDENT")
                .details("Updated student profile: " + updatedStudent.getStudentId())
                .build());

        return DtoMapper.toStudentResponse(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = student.getUser();
        studentRepository.delete(student);
        userRepository.delete(user);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("DELETE_STUDENT")
                .details("Deleted student: " + student.getFirstName() + " " + student.getLastName() + " (" + student.getStudentId() + ")")
                .build());
    }

    @Override
    @Transactional
    public StudentResponse uploadPhoto(Long id, MultipartFile file) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        try {
            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            String originalName = file.getOriginalFilename();
            String fileExtension = originalName != null ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
            String fileName = "student_" + student.getStudentId() + "_" + System.currentTimeMillis() + fileExtension;
            Path filePath = Paths.get(uploadDir, fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            student.setProfilePhoto("/uploads/" + fileName);
            Student savedStudent = studentRepository.save(student);

            return DtoMapper.toStudentResponse(savedStudent);
        } catch (IOException e) {
            throw new BadRequestException("Could not upload profile picture: " + e.getMessage());
        }
    }
}
