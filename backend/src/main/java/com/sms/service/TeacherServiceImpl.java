package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.mapper.DtoMapper;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

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

    @Override
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(DtoMapper::toTeacherResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return DtoMapper.toTeacherResponse(teacher);
    }

    @Override
    public TeacherResponse getTeacherByUsername(String username) {
        Teacher teacher = teacherRepository.findByUser_Username(username)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with username: " + username));
        return DtoMapper.toTeacherResponse(teacher);
    }

    @Override
    @Transactional
    public TeacherResponse createTeacher(TeacherRequest request) {
        if (teacherRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists: " + request.getEmployeeId());
        }
        if (teacherRepository.existsByEmail(request.getEmail()) || userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (teacherRepository.existsByPhone(request.getPhone())) {
                throw new BadRequestException("Phone number already exists: " + request.getPhone());
            }
        }
        if (userRepository.existsByUsername(request.getEmployeeId())) {
            throw new BadRequestException("Username already exists: " + request.getEmployeeId());
        }

        Role teacherRole = roleRepository.findByName("ROLE_TEACHER")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_TEACHER not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        // Create User
        User user = User.builder()
                .username(request.getEmployeeId())
                .password(passwordEncoder.encode("password")) // Default password
                .email(request.getEmail())
                .role(teacherRole)
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);

        // Create Teacher
        Teacher teacher = Teacher.builder()
                .user(savedUser)
                .employeeId(request.getEmployeeId())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(department)
                .qualification(request.getQualification())
                .experience(request.getExperience())
                .build();
        Teacher savedTeacher = teacherRepository.save(teacher);

        // Audit Log
        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("CREATE_TEACHER")
                .details("Registered teacher: " + savedTeacher.getName() + " (" + savedTeacher.getEmployeeId() + ")")
                .build());

        return DtoMapper.toTeacherResponse(savedTeacher);
    }

    @Override
    @Transactional
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        if (!teacher.getEmail().equals(request.getEmail())) {
            if (teacherRepository.existsByEmail(request.getEmail()) || userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists: " + request.getEmail());
            }
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!request.getPhone().equals(teacher.getPhone())) {
                if (teacherRepository.existsByPhone(request.getPhone())) {
                    throw new BadRequestException("Phone number already exists: " + request.getPhone());
                }
            }
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        // Update User
        User user = teacher.getUser();
        user.setEmail(request.getEmail());
        userRepository.save(user);

        // Update Teacher
        teacher.setName(request.getName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setDepartment(department);
        teacher.setQualification(request.getQualification());
        teacher.setExperience(request.getExperience());

        Teacher updatedTeacher = teacherRepository.save(teacher);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("UPDATE_TEACHER")
                .details("Updated teacher profile: " + updatedTeacher.getEmployeeId())
                .build());

        return DtoMapper.toTeacherResponse(updatedTeacher);
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        User user = teacher.getUser();
        teacherRepository.delete(teacher);
        userRepository.delete(user);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("DELETE_TEACHER")
                .details("Deleted teacher: " + teacher.getName() + " (" + teacher.getEmployeeId() + ")")
                .build());
    }
}
