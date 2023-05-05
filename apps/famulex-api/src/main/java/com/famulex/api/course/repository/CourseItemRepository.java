package com.famulex.api.course.repository;

import com.famulex.api.course.model.CourseItem;
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
public interface CourseItemRepository extends JpaRepository<CourseItem, Long> {

  boolean existsByKey(UUID key);

  Optional<CourseItem> findByKey(UUID key);

  List<CourseItem> findAllByNodeKey(UUID nodeKey);
}
