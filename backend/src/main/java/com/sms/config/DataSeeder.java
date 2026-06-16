package com.sms.config;

import com.sms.entity.*;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() > 0) {
            return; // Already seeded
        }

        System.out.println("========== SEEDING H2 IN-MEMORY DATABASE ==========");

        // Seed Roles
        Role adminRole = Role.builder().id(1).name("ROLE_ADMIN").build();
        Role teacherRole = Role.builder().id(2).name("ROLE_TEACHER").build();
        Role studentRole = Role.builder().id(3).name("ROLE_STUDENT").build();
        
        roleRepository.save(adminRole);
        roleRepository.save(teacherRole);
        roleRepository.save(studentRole);

        String defaultEncodedPassword = passwordEncoder.encode("password");

        // Seed Users
        User adminUser = User.builder()
                .id(1L)
                .username("admin")
                .password(defaultEncodedPassword)
                .email("admin@university.edu")
                .role(adminRole)
                .enabled(true)
                .build();
        
        User teacherUser1 = User.builder()
                .id(2L)
                .username("johndoe")
                .password(defaultEncodedPassword)
                .email("johndoe@university.edu")
                .role(teacherRole)
                .enabled(true)
                .build();

        User teacherUser2 = User.builder()
                .id(3L)
                .username("janesmith")
                .password(defaultEncodedPassword)
                .email("janesmith@university.edu")
                .role(teacherRole)
                .enabled(true)
                .build();

        User studentUser1 = User.builder()
                .id(4L)
                .username("alicej")
                .password(defaultEncodedPassword)
                .email("alice.j@student.edu")
                .role(studentRole)
                .enabled(true)
                .build();

        User studentUser2 = User.builder()
                .id(5L)
                .username("bobw")
                .password(defaultEncodedPassword)
                .email("bob.w@student.edu")
                .role(studentRole)
                .enabled(true)
                .build();

        userRepository.save(adminUser);
        userRepository.save(teacherUser1);
        userRepository.save(teacherUser2);
        userRepository.save(studentUser1);
        userRepository.save(studentUser2);

        // Seed Departments
        Department cseDept = Department.builder().id(1L).name("Computer Science & Engineering").code("CSE").build();
        Department itDept = Department.builder().id(2L).name("Information Technology").code("IT").build();
        Department eeDept = Department.builder().id(3L).name("Electrical Engineering").code("EE").build();

        departmentRepository.save(cseDept);
        departmentRepository.save(itDept);
        departmentRepository.save(eeDept);

        // Seed Teachers
        Teacher teacher1 = Teacher.builder()
                .id(1L)
                .user(teacherUser1)
                .employeeId("EMP001")
                .name("Dr. John Doe")
                .email("johndoe@university.edu")
                .phone("+1234567890")
                .department(cseDept)
                .qualification("Ph.D. in Computer Science")
                .experience(10)
                .build();

        Teacher teacher2 = Teacher.builder()
                .id(2L)
                .user(teacherUser2)
                .employeeId("EMP002")
                .name("Prof. Jane Smith")
                .email("janesmith@university.edu")
                .phone("+1987654321")
                .department(itDept)
                .qualification("M.Tech in IT")
                .experience(8)
                .build();

        teacherRepository.save(teacher1);
        teacherRepository.save(teacher2);

        // Seed Students
        Student student1 = Student.builder()
                .id(1L)
                .user(studentUser1)
                .studentId("STU001")
                .firstName("Alice")
                .lastName("Johnson")
                .gender("FEMALE")
                .dateOfBirth(LocalDate.of(2004, 5, 14))
                .email("alice.j@student.edu")
                .mobileNumber("+1122334455")
                .address("123 University Ave, Campus Town")
                .parentName("Richard Johnson")
                .parentContact("+1122334466")
                .admissionDate(LocalDate.of(2023, 8, 1))
                .department(cseDept)
                .semester(2)
                .build();

        Student student2 = Student.builder()
                .id(2L)
                .user(studentUser2)
                .studentId("STU002")
                .firstName("Bob")
                .lastName("Williams")
                .gender("MALE")
                .dateOfBirth(LocalDate.of(2003, 11, 22))
                .email("bob.w@student.edu")
                .mobileNumber("+1122334477")
                .address("456 College Rd, University Town")
                .parentName("Mary Williams")
                .parentContact("+1122334488")
                .admissionDate(LocalDate.of(2022, 8, 1))
                .department(itDept)
                .semester(4)
                .build();

        studentRepository.save(student1);
        studentRepository.save(student2);

        // Seed Courses
        Course course1 = Course.builder()
                .id(1L)
                .code("CSE-101")
                .name("Data Structures & Algorithms")
                .description("Fundamental algorithms, complexity analysis, trees, graphs, and sorting.")
                .credits(4)
                .teacher(teacher1)
                .department(cseDept)
                .semester(2)
                .build();

        Course course2 = Course.builder()
                .id(2L)
                .code("IT-202")
                .name("Web Development Frameworks")
                .description("Frontend and backend development using modern frameworks.")
                .credits(3)
                .teacher(teacher2)
                .department(itDept)
                .semester(4)
                .build();

        Course course3 = Course.builder()
                .id(3L)
                .code("EE-101")
                .name("Basic Electrical Engineering")
                .description("Introduction to electrical networks, AC circuits, and electromagnetism.")
                .credits(3)
                .teacher(null)
                .department(eeDept)
                .semester(1)
                .build();

        courseRepository.save(course1);
        courseRepository.save(course2);
        courseRepository.save(course3);

        // Seed Enrollments
        Enrollment enrollment1 = Enrollment.builder().id(1L).student(student1).course(course1).enrollmentDate(LocalDate.of(2024, 1, 15)).build();
        Enrollment enrollment2 = Enrollment.builder().id(2L).student(student2).course(course2).enrollmentDate(LocalDate.of(2024, 1, 15)).build();

        enrollmentRepository.save(enrollment1);
        enrollmentRepository.save(enrollment2);

        // Seed Attendance
        attendanceRepository.save(Attendance.builder().id(1L).student(student1).course(course1).date(LocalDate.of(2026, 6, 1)).status("PRESENT").remarks("On time").build());
        attendanceRepository.save(Attendance.builder().id(2L).student(student1).course(course1).date(LocalDate.of(2026, 6, 2)).status("PRESENT").remarks("On time").build());
        attendanceRepository.save(Attendance.builder().id(3L).student(student1).course(course1).date(LocalDate.of(2026, 6, 3)).status("ABSENT").remarks("Sick leave").build());
        attendanceRepository.save(Attendance.builder().id(4L).student(student2).course(course2).date(LocalDate.of(2026, 6, 1)).status("PRESENT").remarks("On time").build());
        attendanceRepository.save(Attendance.builder().id(5L).student(student2).course(course2).date(LocalDate.of(2026, 6, 2)).status("LATE").remarks("Traffic delay").build());

        // Seed Exams
        Exam exam1 = Exam.builder().id(1L).course(course1).name("DSA Midterm").examDate(LocalDate.of(2026, 4, 15)).totalMarks(50.0).build();
        Exam exam2 = Exam.builder().id(2L).course(course2).name("Web Dev Final").examDate(LocalDate.of(2026, 5, 20)).totalMarks(100.0).build();

        examRepository.save(exam1);
        examRepository.save(exam2);

        // Seed Results
        resultRepository.save(Result.builder().id(1L).exam(exam1).student(student1).obtainedMarks(45.5).grade("A+").remarks("Excellent logical thinking").build());
        resultRepository.save(Result.builder().id(2L).exam(exam2).student(student2).obtainedMarks(82.0).grade("A").remarks("Good project work").build());

        // Seed Audit Logs
        auditLogRepository.save(AuditLog.builder()
                .id(1L)
                .username("system")
                .action("SYSTEM_INITIALIZATION")
                .details("Programmatically seeded H2 database with default records.")
                .timestamp(LocalDateTime.now())
                .build());

        System.out.println("========== SEEDING COMPLETED SUCCESSFULLY ==========");
    }
}
