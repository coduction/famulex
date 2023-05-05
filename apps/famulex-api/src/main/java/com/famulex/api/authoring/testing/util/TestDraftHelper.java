package com.famulex.api.authoring.testing.util;

import com.famulex.api.authoring.testing.model.*;
import com.famulex.api.core.model.PublicationFeedbackSeverity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Class TestDraftHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 04.03.23
 */
public class TestDraftHelper {

  public static void addFeedbackToQuestionDraft(QuestionDraft question, AnswerDraft answer) {
    // Guards to prevent null pointer exceptions
    if (question == null || answer == null) {
      return;
    }

    // Add feedback to the question
    addFeedbackToParent(question.getPublicationFeedback(), answer.getPublicationFeedback(), TestPublicationFeedbackType.ANSWER_FEEDBACK, answer.getKey());
  }

  public static void addFeedbackToTestDraft(TestDraft test, QuestionDraft question) {
    // Guards to prevent null pointer exceptions
    if (test == null || question == null) {
      return;
    }

    // Add feedback to the test
    addFeedbackToParent(test.getPublicationFeedback(), question.getPublicationFeedback(), TestPublicationFeedbackType.QUESTION_FEEDBACK, question.getKey());
  }

  private static void addFeedbackToParent(List<TestPublicationFeedback> parentFeedback,
                                          List<TestPublicationFeedback> childFeedback,
                                          TestPublicationFeedbackType type,
                                          UUID key) {
    // Guards to prevent null pointer exceptions
    if (parentFeedback == null || childFeedback == null) {
      return;
    }

    // If there is no feedback, we don't need to add it
    if (childFeedback.isEmpty()) {
      return;
    }

    // Only add the most severe feedback
    final TestPublicationFeedback feedback = GetMostSevereFeedback(childFeedback, type, key);

    // If no feedback exists, we don't need to add it. This should never happen, but we check it anyway
    if (feedback == null) {
      return;
    }

    // Check whether any feedback with the given severity and type already exists
    Optional<TestPublicationFeedback> existingFeedback = parentFeedback.stream()
      .filter(f -> f.getSeverity() == feedback.getSeverity() && f.getType() == type)
      .findFirst();

    // If feedback exists, add the key to it
    if (existingFeedback.isPresent()) {
      existingFeedback.get().addKey(key);
      return;
    }

    // If no feedback exists, add it to the parent
    parentFeedback.add(feedback);
  }

  private static TestPublicationFeedback GetMostSevereFeedback(List<TestPublicationFeedback> feedback,
                                                               TestPublicationFeedbackType type,
                                                               UUID key) {
    // Guards to prevent null pointer exceptions
    if (feedback == null || feedback.isEmpty()) {
      return null;
    }

    // If there is any feedback of type ERROR, add it to the test and return
    if (feedback.stream().anyMatch(element -> element.getSeverity() == PublicationFeedbackSeverity.ERROR)) {
      return TestPublicationFeedback.builder()
        .severity(PublicationFeedbackSeverity.ERROR)
        .type(type)
        .key(key)
        .build();
    }

    // If there is any feedback of type WARNING, add it to the test and return
    if (feedback.stream().anyMatch(element -> element.getSeverity() == PublicationFeedbackSeverity.WARNING)) {
      return TestPublicationFeedback.builder()
        .severity(PublicationFeedbackSeverity.WARNING)
        .type(type)
        .key(key)
        .build();
    }

    // If there is any feedback of type INFO, add it to the test and return
    if (feedback.stream().anyMatch(element -> element.getSeverity() == PublicationFeedbackSeverity.INFO)) {
      return TestPublicationFeedback.builder()
        .severity(PublicationFeedbackSeverity.INFO)
        .type(type)
        .key(key)
        .build();
    }

    return null;
  }
}
