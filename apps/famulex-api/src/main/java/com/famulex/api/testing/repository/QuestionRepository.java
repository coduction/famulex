package com.famulex.api.testing.repository;

import com.famulex.api.testing.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface AnswerDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

}
