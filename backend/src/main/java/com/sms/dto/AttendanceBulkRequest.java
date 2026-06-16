package com.sms.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class AttendanceBulkRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Attendance records cannot be null")
    @Valid
    private List<AttendanceRequest> records;
}
