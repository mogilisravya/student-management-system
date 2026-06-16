package com.sms.service;

import com.sms.dto.*;
import com.sms.entity.*;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.mapper.DtoMapper;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public Page<CourseResponse> getAllCourses(String search, Long departmentId, Pageable pageable) {
        String querySearch = (search == null || search.trim().isEmpty()) ? null : search.trim();
        Page<Course> courses = courseRepository.findCoursesFiltered(querySearch, departmentId, pageable);
        return courses.map(DtoMapper::toCourseResponse);
    }

    @Override
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return DtoMapper.toCourseResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Course code already exists: " + request.getCode());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));
        }

        Course course = Course.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .credits(request.getCredits())
                .teacher(teacher)
                .department(department)
                .semester(request.getSemester())
                .build();

        Course savedCourse = courseRepository.save(course);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("CREATE_COURSE")
                .details("Created course: " + savedCourse.getName() + " (" + savedCourse.getCode() + ")")
                .build());

        return DtoMapper.toCourseResponse(savedCourse);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        if (!course.getCode().equals(request.getCode())) {
            if (courseRepository.existsByCode(request.getCode())) {
                throw new BadRequestException("Course code already exists: " + request.getCode());
            }
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));
        }

        course.setCode(request.getCode());
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setTeacher(teacher);
        course.setDepartment(department);
        course.setSemester(request.getSemester());

        Course updatedCourse = courseRepository.save(course);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("UPDATE_COURSE")
                .details("Updated course: " + updatedCourse.getCode())
                .build());

        return DtoMapper.toCourseResponse(updatedCourse);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        courseRepository.delete(course);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("DELETE_COURSE")
                .details("Deleted course: " + course.getName() + " (" + course.getCode() + ")")
                .build());
    }

    @Override
    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new BadRequestException("Student is already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .build();
        enrollmentRepository.save(enrollment);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("ENROLL_STUDENT")
                .details("Enrolled Student ID: " + student.getStudentId() + " in Course: " + course.getCode())
                .build());
    }

    @Override
    @Transactional
    public void unenrollStudent(Long courseId, Long studentId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for student " + studentId + " and course " + courseId));

        enrollmentRepository.delete(enrollment);

        auditLogRepository.save(AuditLog.builder()
                .username("admin")
                .action("UNENROLL_STUDENT")
                .details("Unenrolled Student ID: " + enrollment.getStudent().getStudentId() + " from Course: " + enrollment.getCourse().getCode())
                .build());
    }

    @Override
    public List<StudentResponse> getEnrolledStudents(Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        return enrollments.stream()
                .map(enrollment -> DtoMapper.toStudentResponse(enrollment.getStudent()))
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> getCoursesByStudent(Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        return enrollments.stream()
                .map(enrollment -> DtoMapper.toCourseResponse(enrollment.getCourse()))
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> getCoursesByTeacher(Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return courses.stream()
                .map(DtoMapper::toCourseResponse)
                .collect(Collectors.toList());
    }
}
