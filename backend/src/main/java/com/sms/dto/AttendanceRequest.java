package com.sms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Status is required")
    private String status; // PRESENT, ABSENT, LATE, EXCUSED

    private String remarks;
}
