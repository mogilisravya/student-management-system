package com.sms.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private String username;
    private String email;
    private String role;
    
    // Student fields
    private String studentId;
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dateOfBirth;
    private String mobileNumber;
    private String address;
    private String parentName;
    private String parentContact;
    private String departmentName;
    private Integer semester;
    private String profilePhoto;

    // Teacher fields
    private String employeeId;
    private String teacherName;
    private String phone;
    private String qualification;
    private Integer experience;
}
