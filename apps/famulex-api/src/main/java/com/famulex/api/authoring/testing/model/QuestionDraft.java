package com.famulex.api.authoring.testing.model;

import com.famulex.api.authoring.testing.util.TestDraftHelper;
import com.famulex.api.core.model.Positionable;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.core.model.PublicationFeedbackSeverity;
import com.famulex.api.testing.model.Question;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Class TestDraft
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.10.22
 */
@Getter
@Setter
@Entity
@Table(name = "fx_question_draft")
public class QuestionDraft extends PublicKey implements Positionable {

  @Column(name = "published_at")
  private OffsetDateTime publishedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_test_draft", nullable = false)
  private TestDraft testDraft;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private QuestionType type;
  @Column(name = "position", nullable = false)
  private Integer position;
  @Column(name = "required", nullable = false)
  private boolean required;

  @Column(name = "title")
  private String title;
  @Column(name = "description")
  private String description;
  @Column(name = "question", nullable = false)
  private String question;

  @Column(name = "points", nullable = false)
  private Double points;
  @Column(name = "deduction_wrong_answer")
  private Double deductionWrongAnswer;
  @Column(name = "allow_empty")
  private Boolean allowEmpty;
  @Column(name = "shown_answers")
  private Integer shownAnswers;
  @Column(name = "shuffle_answers", nullable = false)
  private Boolean shuffleAnswers;
  @Column(name = "review_manually", nullable = false)
  private Boolean reviewManually;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "questionDraft", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<AnswerDraft> answers = new ArrayList<>();

  @OrderBy("version DESC")
  @OneToMany(mappedBy = "questionDraft")
  private List<Question> publishedQuestions = new ArrayList<>();

  @Transient
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();

  @PreRemove
  public void preRemove() {
    publishedQuestions.forEach(question -> question.setQuestionDraft(null));
  }

  //    @PostLoad
  @PostUpdate
  @PostPersist
  @Transactional
  public void validate() {
    // Clear all previous feedback
    publicationFeedback.clear();

    // Validate question
    long correctAnswers = answers.stream().filter(AnswerDraft::isCorrect).count();

    if (shownAnswers != null) {
      if (shownAnswers == 0) {
        publicationFeedback.add(TestPublicationFeedback.builder()
          .type(TestPublicationFeedbackType.NOT_ENOUGH_SHOWN_ANSWERS)
          .severity(PublicationFeedbackSeverity.ERROR)
          .key(key)
          .build());
      } else if (shownAnswers > answers.size()) {
        publicationFeedback.add(TestPublicationFeedback.builder()
          .type(TestPublicationFeedbackType.TOO_MANY_SHOWN_ANSWERS)
          .severity(PublicationFeedbackSeverity.WARNING)
          .key(key)
          .build());
      }

      if (shownAnswers != null && !Boolean.TRUE.equals(shuffleAnswers)) {
        publicationFeedback.add(TestPublicationFeedback.builder()
          .type(TestPublicationFeedbackType.LIMIT_ANSWERS_AND_NO_SHUFFLE)
          .severity(PublicationFeedbackSeverity.ERROR)
          .key(key)
          .build());
      }
    }

    switch (type) {
      case SINGLE_CHOICE -> {
        checkAnswerCount();
        if (correctAnswers > 1) {
          publicationFeedback.add(TestPublicationFeedback.builder()
            .type(TestPublicationFeedbackType.TOO_MANY_CORRECT_ANSWERS)
            .severity(PublicationFeedbackSeverity.ERROR)
            .key(key)
            .build());
        } else if (Boolean.FALSE.equals(allowEmpty) && correctAnswers == 0) {
          publicationFeedback.add(TestPublicationFeedback.builder()
            .type(TestPublicationFeedbackType.NO_CORRECT_ANSWER)
            .severity(PublicationFeedbackSeverity.ERROR)
            .key(key)
            .build());
        }
      }

      case MULTIPLE_CHOICE -> {
        checkAnswerCount();
        if (correctAnswers == 0) {
          publicationFeedback.add(TestPublicationFeedback.builder()
            .type(TestPublicationFeedbackType.NO_CORRECT_ANSWER)
            .severity(PublicationFeedbackSeverity.INFO)
            .key(key)
            .build());
        }
      }
    }

    // Validate answers
    answers.forEach(AnswerDraft::validate);

    // Add feedback to test
    TestDraftHelper.addFeedbackToTestDraft(testDraft, this);
  }

  @Transactional
  public boolean isValid(boolean triggerValidation) {
    if (triggerValidation) {
      validate();
    }

    return publicationFeedback.stream().noneMatch(feedback -> feedback.getSeverity() == PublicationFeedbackSeverity.ERROR);
  }

  @Transactional
  public boolean isInvalid(boolean triggerValidation) {
    return !isValid(triggerValidation);
  }

  private void checkAnswerCount() {
    if (answers.size() == 0) {
      publicationFeedback.add(TestPublicationFeedback.builder()
        .type(TestPublicationFeedbackType.NO_ANSWERS)
        .severity(PublicationFeedbackSeverity.ERROR)
        .key(key)
        .build());
    } else if (shownAnswers != null && shownAnswers > answers.size()) {
      publicationFeedback.add(TestPublicationFeedback.builder()
        .type(TestPublicationFeedbackType.NOT_ENOUGH_ANSWERS)
        .severity(PublicationFeedbackSeverity.WARNING)
        .key(key)
        .build());
    }

    // Validate answers
    answers.forEach(AnswerDraft::validate);
  }

}
