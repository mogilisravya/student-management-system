package com.sms.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class StudentRequest {
    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String mobileNumber;
    private String address;
    private String parentName;
    private String parentContact;

    @NotNull(message = "Admission date is required")
    private LocalDate admissionDate;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 8, message = "Semester must be at most 8")
    private Integer semester;
}
