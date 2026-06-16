package com.sms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer credits;
    private Long teacherId;
    private String teacherName;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private Integer semester;
}
