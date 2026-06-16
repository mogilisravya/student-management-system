package com.sms.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCode;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private LocalDate date;
    private String status;
    private String remarks;
}
