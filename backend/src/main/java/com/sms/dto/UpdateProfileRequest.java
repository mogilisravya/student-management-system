package com.sms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    private String email;
    private String phone; // Maps to phone for teachers, mobileNumber for students
    private String address; // For students
}
