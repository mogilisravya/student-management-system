package com.sms.service;

import com.sms.dto.StudentRequest;
import com.sms.dto.StudentResponse;
import com.sms.entity.Department;
import com.sms.entity.Role;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.exception.BadRequestException;
import com.sms.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private StudentRequest request;
    private Role studentRole;
    private Department department;
    private User user;
    private Student student;

    @BeforeEach
    public void setup() {
        request = new StudentRequest();
        request.setStudentId("STU123");
        request.setFirstName("John");
        request.setLastName("Smith");
        request.setGender("MALE");
        request.setDateOfBirth(LocalDate.of(2004, 1, 1));
        request.setEmail("john.smith@student.edu");
        request.setAdmissionDate(LocalDate.now());
        request.setDepartmentId(1L);
        request.setSemester(2);

        studentRole = Role.builder().id(3).name("ROLE_STUDENT").build();
        department = Department.builder().id(1L).name("Computer Science").code("CS").build();
        user = User.builder().id(10L).username("STU123").email("john.smith@student.edu").role(studentRole).build();
        student = Student.builder()
                .id(1L)
                .user(user)
                .studentId("STU123")
                .firstName("John")
                .lastName("Smith")
                .gender("MALE")
                .dateOfBirth(LocalDate.of(2004, 1, 1))
                .email("john.smith@student.edu")
                .department(department)
                .semester(2)
                .build();
    }

    @Test
    public void testCreateStudent_Success() {
        when(studentRepository.existsByStudentId(request.getStudentId())).thenReturn(false);
        when(studentRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(request.getStudentId())).thenReturn(false);
        when(roleRepository.findByName("ROLE_STUDENT")).thenReturn(Optional.of(studentRole));
        when(departmentRepository.findById(request.getDepartmentId())).thenReturn(Optional.of(department));
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentResponse response = studentService.createStudent(request);

        assertNotNull(response);
        assertEquals("STU123", response.getStudentId());
        assertEquals("John", response.getFirstName());
        assertEquals("Computer Science", response.getDepartmentName());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    public void testCreateStudent_ConflictStudentId() {
        when(studentRepository.existsByStudentId(request.getStudentId())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> studentService.createStudent(request));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    public void testCreateStudent_ConflictMobileNumber() {
        request.setMobileNumber("+1122334455");
        when(studentRepository.existsByStudentId(request.getStudentId())).thenReturn(false);
        when(studentRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(studentRepository.existsByMobileNumber(request.getMobileNumber())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> studentService.createStudent(request));
        verify(studentRepository, never()).save(any(Student.class));
    }
}
