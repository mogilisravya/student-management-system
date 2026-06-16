package com.sms.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherRequest {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotNull(message = "Department is required")
    private Long departmentId;

    private String qualification;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;
}
