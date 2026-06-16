package com.sms.repository;

import com.sms.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByUser_Username(String username);
    boolean existsByStudentId(String studentId);
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);

    @Query("SELECT s FROM Student s WHERE " +
           "(:search IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.studentId) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:departmentId IS NULL OR s.department.id = :departmentId) AND " +
           "(:semester IS NULL OR s.semester = :semester)")
    Page<Student> findStudentsFiltered(
            @Param("search") String search,
            @Param("departmentId") Long departmentId,
            @Param("semester") Integer semester,
            Pageable pageable);
}
