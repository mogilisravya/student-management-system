package com.sms.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ExamRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Exam name is required")
    private String name;

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Total marks are required")
    @Min(value = 1, message = "Total marks must be at least 1")
    private Double totalMarks;
}
