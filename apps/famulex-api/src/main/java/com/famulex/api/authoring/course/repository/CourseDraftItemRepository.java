package com.famulex.api.authoring.course.repository;

import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.authoring.course.model.CourseDraftNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface CourseDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@Repository
public interface CourseDraftItemRepository extends JpaRepository<CourseDraftItem, Long> {

  boolean existsByKey(UUID key);

  Optional<CourseDraftItem> findByKey(UUID key);

  List<CourseDraftItem> findAllByNodeKey(UUID nodeKey);

  List<CourseDraftItem> findByNodeOrderByPosition(CourseDraftNode node);
}
