package com.sms.mapper;

import com.sms.dto.*;
import com.sms.entity.*;

public class DtoMapper {

    public static StudentResponse toStudentResponse(Student student) {
        if (student == null) return null;
        return StudentResponse.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .email(student.getEmail())
                .mobileNumber(student.getMobileNumber())
                .address(student.getAddress())
                .parentName(student.getParentName())
                .parentContact(student.getParentContact())
                .admissionDate(student.getAdmissionDate())
                .departmentId(student.getDepartment() != null ? student.getDepartment().getId() : null)
                .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : null)
                .departmentCode(student.getDepartment() != null ? student.getDepartment().getCode() : null)
                .semester(student.getSemester())
                .profilePhoto(student.getProfilePhoto())
                .username(student.getUser() != null ? student.getUser().getUsername() : null)
                .build();
    }

    public static TeacherResponse toTeacherResponse(Teacher teacher) {
        if (teacher == null) return null;
        return TeacherResponse.builder()
                .id(teacher.getId())
                .employeeId(teacher.getEmployeeId())
                .name(teacher.getName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .departmentId(teacher.getDepartment() != null ? teacher.getDepartment().getId() : null)
                .departmentName(teacher.getDepartment() != null ? teacher.getDepartment().getName() : null)
                .departmentCode(teacher.getDepartment() != null ? teacher.getDepartment().getCode() : null)
                .qualification(teacher.getQualification())
                .experience(teacher.getExperience())
                .username(teacher.getUser() != null ? teacher.getUser().getUsername() : null)
                .build();
    }

    public static CourseResponse toCourseResponse(Course course) {
        if (course == null) return null;
        return CourseResponse.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .description(course.getDescription())
                .credits(course.getCredits())
                .teacherId(course.getTeacher() != null ? course.getTeacher().getId() : null)
                .teacherName(course.getTeacher() != null ? course.getTeacher().getName() : null)
                .departmentId(course.getDepartment() != null ? course.getDepartment().getId() : null)
                .departmentName(course.getDepartment() != null ? course.getDepartment().getName() : null)
                .departmentCode(course.getDepartment() != null ? course.getDepartment().getCode() : null)
                .semester(course.getSemester())
                .build();
    }

    public static AttendanceResponse toAttendanceResponse(Attendance attendance) {
        if (attendance == null) return null;
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName())
                .studentCode(attendance.getStudent().getStudentId())
                .courseId(attendance.getCourse().getId())
                .courseName(attendance.getCourse().getName())
                .courseCode(attendance.getCourse().getCode())
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .build();
    }

    public static ExamResponse toExamResponse(Exam exam) {
        if (exam == null) return null;
        return ExamResponse.builder()
                .id(exam.getId())
                .courseId(exam.getCourse().getId())
                .courseName(exam.getCourse().getName())
                .courseCode(exam.getCourse().getCode())
                .name(exam.getName())
                .examDate(exam.getExamDate())
                .totalMarks(exam.getTotalMarks())
                .build();
    }

    public static ResultResponse toResultResponse(Result result) {
        if (result == null) return null;
        return ResultResponse.builder()
                .id(result.getId())
                .examId(result.getExam().getId())
                .examName(result.getExam().getName())
                .courseId(result.getExam().getCourse().getId())
                .courseName(result.getExam().getCourse().getName())
                .courseCode(result.getExam().getCourse().getCode())
                .studentId(result.getStudent().getId())
                .studentName(result.getStudent().getFirstName() + " " + result.getStudent().getLastName())
                .studentCode(result.getStudent().getStudentId())
                .obtainedMarks(result.getObtainedMarks())
                .totalMarks(result.getExam().getTotalMarks())
                .grade(result.getGrade())
                .remarks(result.getRemarks())
                .build();
    }

    public static DepartmentResponse toDepartmentResponse(Department department) {
        if (department == null) return null;
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .code(department.getCode())
                .build();
    }
}
