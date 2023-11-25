package com.famulex.api.authoring.testing.repository;

import com.famulex.api.authoring.testing.model.QuestionDraft;
import com.famulex.api.authoring.testing.model.SectionDraft;
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
public interface QuestionDraftRepository extends JpaRepository<QuestionDraft, Long> {

  boolean existsByKey(UUID key);

  Optional<QuestionDraft> findByKey(UUID key);

  List<QuestionDraft> findBySectionDraftTestDraftKey(UUID testDraftKey);

  List<QuestionDraft> findBySectionDraftOrderByPosition(SectionDraft sectionDraft);

  List<QuestionDraft> findBySectionDraftKeyOrderByPosition(UUID sectionDraftKey);

  void deleteByKey(UUID key);
}
