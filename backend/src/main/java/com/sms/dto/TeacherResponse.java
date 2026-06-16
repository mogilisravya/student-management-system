package com.sms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponse {
    private Long id;
    private String employeeId;
    private String name;
    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private String qualification;
    private Integer experience;
    private String username;
}
