package com.famulex.api.authoring.testing;

import com.famulex.api.authoring.testing.api.TestDraftMapper;
import com.famulex.api.authoring.testing.model.*;
import com.famulex.api.authoring.testing.repository.AnswerDraftRepository;
import com.famulex.api.authoring.testing.repository.QuestionDraftRepository;
import com.famulex.api.authoring.testing.repository.SectionDraftRepository;
import com.famulex.api.authoring.testing.repository.TestDraftRepository;
import com.famulex.api.authoring.testing.util.TestDraftPublicationMapper;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.core.exception.UnexpectedErrorException;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.testing.model.Test;
import com.famulex.api.testing.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Class TestDraftService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.03.23
 */
@Service
@RequiredArgsConstructor
public class TestDraftService {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final TestDraftRepository testDraftRepository;
  private final SectionDraftRepository sectionDraftRepository;
  private final QuestionDraftRepository questionDraftRepository;
  private final AnswerDraftRepository answerDraftRepository;

  private final TestRepository testRepository;

  /**************************************************************************
   * Mappers
   *************************************************************************/
  private final TestDraftMapper testDraftMapper;
  private final TestDraftPublicationMapper testDraftPublicationMapper;

  @Transactional
  public TestDraft publishTestDraft(TestDraft testDraft) {
    // Load the necessary data in advance to prevent any triggers regarding @PreUpdate TODO Question: Why is onUpdate even invoked?
    var publishedVersion = testDraft.getPublishedVersion();
    var existingTest = testRepository.findByVersionAndTestDraft(publishedVersion, testDraft).orElse(null);

    // Indicate that we want to publish the test draft
    testDraft.setPublish(true);

    // Check the status of the test draft
    checkStatus(testDraft, false, false);

    // If the test is not valid, return the test draft
    if (testDraft.getStatus() != TestStatus.PUBLISHED) {
      return testDraftRepository.save(testDraft);
    }

    // Convert test draft to test
    var test = testDraftPublicationMapper.toTest(testDraft);

    // If there are no existing versions, publish the test as version 1
    if (publishedVersion == null || publishedVersion == 0) {
      test.setVersion(1);
      testDraft.setPublishedVersion(1);

      // Save test and draft
      testRepository.save(test);
      return testDraftRepository.save(testDraft);
    }

    if (testContainsChanges(existingTest, test)) {
      test.setVersion(publishedVersion + 1);
      testDraft.setPublishedVersion(publishedVersion + 1);

      // Save test and draft
      testRepository.save(test);
      return testDraftRepository.save(testDraft);
    }

    // Return the test draft unchanged. The publicationDate
    testDraft.setPublish(false);
    return testDraftRepository.save(testDraft);
  }

  @Transactional
  public boolean testContainsChanges(Test existingTest, Test newTest) {
    if (existingTest == null || newTest == null) {
      return true;
    }

    // Compare tests
    if (existingTest.isDifferent(newTest)) {
      return true;
    }

    return false;
  }

  /**
   * Checks the status of a test draft and saves it. Should be executed after anything related to the test draft has been changed.
   *
   * @param testDraft
   * @param reload
   * @return
   */
  @Transactional
  public TestDraft checkStatus(TestDraft testDraft, boolean reload, boolean updateEntity) {
    // If we reload the entity, we do not want to trigger validation since it is done @PostLoad
    boolean triggerValidation = !reload;

    // Reload test draft if necessary
    if (reload) {
      testDraft = testDraftRepository.findById(testDraft.getId())
        .orElseThrow(() -> new UnexpectedErrorException("Test draft was not found upon reload."));
    }

    // Check if test draft status.
    testDraft.checkTestStatus(triggerValidation);

    // Save test draft
    if (updateEntity) {
      testDraftRepository.save(testDraft);
    }

    return testDraft;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_UNCOMMITTED)
  public TestDraft checkStatus(UUID key) {
    // Load test draft
    var testDraft = testDraftRepository.findByKey(key)
      .orElseThrow(() -> new EntityNotFoundException(TestDraft.class, key));

    return checkStatus(testDraft, false, true);
  }

  /**************************************************************************
   * Helper Methods
   *************************************************************************/
  public void checkExistence(UUID testDraftKey) {
    if (!testDraftRepository.existsByKey(testDraftKey)) {
      throw new EntityNotFoundException(TestDraft.class, testDraftKey);
    }
  }

  public void checkExistence(UUID testDraftKey, UUID questionDraftKey) {
    checkExistence(testDraftKey);

    if (!questionDraftRepository.existsByKey(questionDraftKey)) {
      throw new EntityNotFoundException(QuestionDraft.class, questionDraftKey);
    }
  }

  public void checkExistence(UUID testDraftKey, UUID questionDraftKey, UUID answerDraftKey) {
    checkExistence(testDraftKey, questionDraftKey);

    if (!answerDraftRepository.existsByKey(answerDraftKey)) {
      throw new EntityNotFoundException(CourseItem.class, answerDraftKey);
    }
  }

  public TestDraft loadTestDraft(UUID testDraftKey) {
    return testDraftRepository.findByKey(testDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(TestDraft.class, testDraftKey));
  }

  public SectionDraft loadSectionDraft(UUID sectionDraftKey) {
    return sectionDraftRepository.findByKey(sectionDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(SectionDraft.class, sectionDraftKey));
  }

  public SectionDraft loadSectionDraftParent(UUID sectionDraftParentKey) {
    return sectionDraftRepository.findByKey(sectionDraftParentKey)
      .orElse(null);
  }

  public QuestionDraft loadQuestionDraft(UUID questionDraftKey) {
    return questionDraftRepository.findByKey(questionDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(QuestionDraft.class, questionDraftKey));
  }

  public AnswerDraft loadAnswerDraft(UUID answerDraftKey) {
    return answerDraftRepository.findByKey(answerDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(AnswerDraft.class, answerDraftKey));
  }
}
