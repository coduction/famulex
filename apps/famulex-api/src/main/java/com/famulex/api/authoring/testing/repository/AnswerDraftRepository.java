package com.famulex.api.authoring.testing.repository;

import com.famulex.api.authoring.testing.model.AnswerDraft;
import com.famulex.api.authoring.testing.model.QuestionDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface AnswerDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Repository
public interface AnswerDraftRepository extends JpaRepository<AnswerDraft, Long> {

  boolean existsByKey(UUID key);

  Optional<AnswerDraft> findByKey(UUID key);

  List<AnswerDraft> findByQuestionDraftOrderByPosition(QuestionDraft questionDraft);

  List<AnswerDraft> findByQuestionDraftKeyOrderByPosition(UUID questionDraftKey);

  List<AnswerDraft> findByQuestionDraftSectionDraftTestDraftKey(UUID testDraftKey);

}
