package com.sms.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultRequest {
    @NotNull(message = "Exam ID is required")
    private Long examId;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Obtained marks are required")
    @Min(value = 0, message = "Obtained marks cannot be negative")
    private Double obtainedMarks;

    private String remarks;
}
