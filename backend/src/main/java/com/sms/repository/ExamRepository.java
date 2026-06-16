package com.sms.repository;

import com.sms.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCourseId(Long courseId);
    List<Exam> findByCourseIdIn(List<Long> courseIds);
}
