package com.sms.service;

import com.sms.entity.*;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ResultService resultService;

    @Override
    public byte[] generateStudentReportCSV() {
        List<Student> students = studentRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("Student ID,First Name,Last Name,Gender,DOB,Email,Mobile,Department,Semester,Admission Date\n");

        for (Student student : students) {
            sb.append(escapeCSV(student.getStudentId())).append(",")
              .append(escapeCSV(student.getFirstName())).append(",")
              .append(escapeCSV(student.getLastName())).append(",")
              .append(escapeCSV(student.getGender())).append(",")
              .append(student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : "").append(",")
              .append(escapeCSV(student.getEmail())).append(",")
              .append(escapeCSV(student.getMobileNumber())).append(",")
              .append(student.getDepartment() != null ? escapeCSV(student.getDepartment().getName()) : "").append(",")
              .append(student.getSemester()).append(",")
              .append(student.getAdmissionDate() != null ? student.getAdmissionDate().toString() : "").append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] generateAttendanceReportCSV(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        List<Attendance> attendances = attendanceRepository.findByCourseId(courseId);
        
        StringBuilder sb = new StringBuilder();
        sb.append("Course Code: ").append(course.getCode()).append(", Course Name: ").append(course.getName()).append("\n\n");
        sb.append("Student ID,Student Name,Date,Status,Remarks\n");

        for (Attendance att : attendances) {
            String studentName = att.getStudent().getFirstName() + " " + att.getStudent().getLastName();
            sb.append(escapeCSV(att.getStudent().getStudentId())).append(",")
              .append(escapeCSV(studentName)).append(",")
              .append(att.getDate().toString()).append(",")
              .append(escapeCSV(att.getStatus())).append(",")
              .append(escapeCSV(att.getRemarks())).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] generatePerformanceReportCSV(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        StringBuilder sb = new StringBuilder();
        sb.append("Performance Report for: ").append(course.getCode()).append(" - ").append(course.getName()).append("\n\n");
        sb.append("Student ID,Student Name,Exam,Obtained Marks,Total Marks,Grade,Remarks\n");

        List<Student> students = studentRepository.findAll();
        for (Student student : students) {
            List<Result> results = resultRepository.findByStudentIdAndExam_CourseId(student.getId(), courseId);
            for (Result r : results) {
                String studentName = student.getFirstName() + " " + student.getLastName();
                sb.append(escapeCSV(student.getStudentId())).append(",")
                  .append(escapeCSV(studentName)).append(",")
                  .append(escapeCSV(r.getExam().getName())).append(",")
                  .append(r.getObtainedMarks()).append(",")
                  .append(r.getExam().getTotalMarks()).append(",")
                  .append(escapeCSV(r.getGrade())).append(",")
                  .append(escapeCSV(r.getRemarks())).append("\n");
            }
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] generateStudentReportCardTXT(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Double gpa = resultService.calculateStudentGpa(studentId);
        List<Result> results = resultRepository.findByStudentId(student.getId());

        StringBuilder sb = new StringBuilder();
        sb.append("========================================================================\n");
        sb.append("                       UNIVERSITY ACADEMIC REPORT CARD                  \n");
        sb.append("========================================================================\n\n");
        sb.append(" Student ID      : ").append(student.getStudentId()).append("\n");
        sb.append(" Student Name    : ").append(student.getFirstName()).append(" ").append(student.getLastName()).append("\n");
        sb.append(" Gender          : ").append(student.getGender()).append("\n");
        sb.append(" DOB             : ").append(student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : "").append("\n");
        sb.append(" Department      : ").append(student.getDepartment() != null ? student.getDepartment().getName() : "").append("\n");
        sb.append(" Current Semester: ").append(student.getSemester()).append("\n");
        sb.append(" Cumulative GPA  : ").append(gpa).append("\n\n");
        sb.append("------------------------------------------------------------------------\n");
        sb.append(String.format(" %-12s | %-25s | %-12s | %-8s | %-5s\n", "COURSE CODE", "COURSE NAME", "EXAM", "MARKS", "GRADE"));
        sb.append("------------------------------------------------------------------------\n");

        for (Result r : results) {
            String marksStr = r.getObtainedMarks() + "/" + r.getExam().getTotalMarks();
            sb.append(String.format(" %-12s | %-25s | %-12s | %-8s | %-5s\n",
                    truncate(r.getExam().getCourse().getCode(), 12),
                    truncate(r.getExam().getCourse().getName(), 25),
                    truncate(r.getExam().getName(), 12),
                    marksStr,
                    r.getGrade()));
        }
        sb.append("------------------------------------------------------------------------\n\n");
        sb.append(" Generated Date  : ").append(java.time.LocalDate.now().toString()).append("\n");
        sb.append("========================================================================\n");

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCSV(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private String truncate(String val, int maxLen) {
        if (val == null) return "";
        return val.length() > maxLen ? val.substring(0, maxLen - 3) + "..." : val;
    }
}
