package com.sms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "student_id", unique = true, nullable = false, length = 50)
    private String studentId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(length = 10)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "mobile_number", unique = true, length = 20)
    private String mobileNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "parent_name", length = 100)
    private String parentName;

    @Column(name = "parent_contact", length = 20)
    private String parentContact;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    private Integer semester;

    @Column(name = "profile_photo")
    private String profilePhoto;
}
