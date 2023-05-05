package com.famulex.api.testing.repository;

import com.famulex.api.authoring.testing.model.TestDraft;
import com.famulex.api.testing.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
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
public interface TestRepository extends JpaRepository<Test, Long> {

  Optional<Test> findByKey(UUID key);

  Optional<Test> findByVersionAndTestDraft(Integer version, TestDraft testDraft);

  int countByTestDraft(TestDraft testDraft);   // TODO Question: PreUpdate is invoked when calling this method. Why? Quickfix: Using id instead of object
}
