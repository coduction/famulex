package com.famulex.api.course.repository;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Interface CourseRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 23.02.22
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

  boolean existsByKey(UUID key);

  Optional<Course> findByKey(UUID key);

  Optional<Course> findByCourseDraft(CourseDraft courseDraft);

  Optional<Course> findByMembershipsKey(UUID membershipKey);

  void deleteByCourseDraft(CourseDraft courseDraft);
}
