package com.sms.repository;

import com.sms.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);
    List<Course> findByTeacherId(Long teacherId);

    @Query("SELECT c FROM Course c WHERE " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:departmentId IS NULL OR c.department.id = :departmentId)")
    Page<Course> findCoursesFiltered(
            @Param("search") String search,
            @Param("departmentId") Long departmentId,
            Pageable pageable);
}
