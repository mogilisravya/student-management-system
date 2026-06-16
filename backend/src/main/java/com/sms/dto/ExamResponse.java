package com.sms.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResponse {
    private Long id;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private String name;
    private LocalDate examDate;
    private Double totalMarks;
}
