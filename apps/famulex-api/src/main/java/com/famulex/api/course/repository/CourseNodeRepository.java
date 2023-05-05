package com.famulex.api.course.repository;

import com.famulex.api.course.model.CourseNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface CourseNodeRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 23.02.22
 */
@Repository
public interface CourseNodeRepository extends JpaRepository<CourseNode, Long> {

  Optional<CourseNode> findByKey(UUID key);

  List<CourseNode> findAllByCourseKey(UUID courseKey);

  boolean existsByKey(UUID key);
}
