package com.sms.repository;

import com.sms.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    List<Result> findByExamId(Long examId);
    Optional<Result> findByExamIdAndStudentId(Long examId, Long studentId);
    List<Result> findByStudentIdAndExam_CourseId(Long studentId, Long courseId);
}
