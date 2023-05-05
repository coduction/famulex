package com.famulex.api.authoring.testing.repository;

import com.famulex.api.authoring.testing.model.TestDraft;
import com.famulex.api.authoring.testing.model.TestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Interface AnswerDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Repository
public interface TestDraftRepository extends JpaRepository<TestDraft, Long> {

  boolean existsByKey(UUID key);

  Optional<TestDraft> findByKey(UUID key);

  @Query("SELECT t.status FROM TestDraft t WHERE t.key = :key")
  Optional<TestStatus> findStatusByKey(@Param("key") UUID key);

  // TODO Strange behaviour with EntityGraph - If you have multiple answers, the question is loaded multiple times as well
  //@EntityGraph(value = "TestDraft.Content", type = EntityGraph.EntityGraphType.LOAD)
  //Optional<TestDraft> findWithQuestionsByKey(UUID key);

}
