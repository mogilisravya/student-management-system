package com.sms.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {
    private Long id;
    private String studentId;
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dateOfBirth;
    private String email;
    private String mobileNumber;
    private String address;
    private String parentName;
    private String parentContact;
    private LocalDate admissionDate;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private Integer semester;
    private String profilePhoto;
    private String username;
}
