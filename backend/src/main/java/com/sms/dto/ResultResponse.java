package com.sms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponse {
    private Long id;
    private Long examId;
    private String examName;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Long studentId;
    private String studentName;
    private String studentCode;
    private Double obtainedMarks;
    private Double totalMarks;
    private String grade;
    private String remarks;
}
