package com.famulex.api.testing.execution.repository;

import com.famulex.api.testing.execution.model.TestExecutionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface AnswerDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Repository
public interface TestExecutionAnswerRepository extends JpaRepository<TestExecutionAnswer, Long> {

}
