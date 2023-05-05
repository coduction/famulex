package com.famulex.api.authoring.course.repository;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftNode;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Interface CourseDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 23.02.22
 */
@Repository
public interface CourseDraftNodeRepository extends JpaRepository<CourseDraftNode, Long> {

  @EntityGraph(value = "CourseDraftNode.Items", type = EntityGraph.EntityGraphType.LOAD)
  Optional<CourseDraftNode> findWithItemsById(@Param("id") Long id);

  Optional<CourseDraftNode> findByKey(UUID key);

  Optional<CourseDraftNode> findByCourseDraftKeyAndKey(UUID courseDraftKey, UUID key);

  Set<CourseDraftNode> findByCourseDraftKey(UUID courseDraftKey);

  @Query("SELECT node " +
    "FROM CourseDraftNode node " +
    "LEFT JOIN FETCH node.items " +
    "WHERE node.courseDraft = :courseDraft")
  Set<CourseDraftNode> findAllByCourseDraftWithItems(@Param("courseDraft") CourseDraft courseDraft);

  List<CourseDraftNode> findAllByParentOrderByPosition(CourseDraftNode parent);

  boolean existsByKey(UUID key);

}
