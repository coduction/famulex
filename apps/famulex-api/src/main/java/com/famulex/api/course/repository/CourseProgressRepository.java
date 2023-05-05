package com.famulex.api.course.repository;

import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseProgress;
import com.famulex.api.membership.model.CourseMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface CourseItemRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 23.02.22
 */
@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {

  Optional<CourseProgress> findByKey(UUID key);

  List<CourseProgress> findByMembership(CourseMembership membership);

  Optional<CourseProgress> findByMembershipAndCourse(CourseMembership membership, Course course);

  List<CourseProgress> findByMembershipIn(List<CourseMembership> memberships);

}
