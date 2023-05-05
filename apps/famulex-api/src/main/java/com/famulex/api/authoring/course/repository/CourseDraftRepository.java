package com.famulex.api.authoring.course.repository;

import com.famulex.api.authoring.course.model.CourseDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Interface CourseDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 23.02.22
 */
@Repository
public interface CourseDraftRepository extends JpaRepository<CourseDraft, Long> {

  Optional<CourseDraft> findByKey(UUID key);

//    @EntityGraph(value = "CourseDraft.Content", type = EntityGraph.EntityGraphType.LOAD)
//    Optional<CourseDraft> findWithContentByKey(UUID key);

  boolean existsByKey(UUID key);

}
