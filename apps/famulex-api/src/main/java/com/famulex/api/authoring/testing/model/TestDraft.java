package com.famulex.api.authoring.testing.model;

import com.famulex.api.core.model.DeletedAt;
import com.famulex.api.core.model.PublicationFeedbackSeverity;
import com.famulex.api.testing.model.Test;
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
@Table(name = "fx_test_draft")
public class TestDraft extends DeletedAt {

  @Column(name = "archived_at")
  private OffsetDateTime archivedAt;
  @Column(name = "published_at")
  private OffsetDateTime publishedAt;
  @Column(name = "published_version")
  private Integer publishedVersion;
  @Transient
  private boolean publish;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private TestStatus status;

  @Column(name = "title", nullable = false)
  private String title;
  @Column(name = "description")
  private String description;
  @Column(name = "author")
  private String author;

  // The following values are default configurations for the test
  @Enumerated(EnumType.STRING)
  @Column(name = "execution_mode", nullable = false)
  private TestExecutionMode executionMode;
  @Column(name = "points_to_pass")
  private Double pointsToPass;
  @Column(name = "percentage_to_pass")
  private Double percentageToPass;
  @Column(name = "duration")
  private Integer duration;
  @Column(name = "shuffle_questions")
  private boolean shuffleQuestions;
  @Column(name = "shown_questions")
  private Integer shownQuestions;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "testDraft", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<QuestionDraft> questions = new ArrayList<>();

  @OrderBy("version DESC")
  @OneToMany(mappedBy = "testDraft")
  private List<Test> publishedTests = new ArrayList<>();

  @Transient
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();

  @PreRemove
  public void preRemove() {
    publishedTests.forEach(test -> test.setTestDraft(null));
  }

  @Override
  protected void preUpdate() {
    super.preUpdate();

    if (publish) {
      publishedAt = updatedAt;
    }
  }

  @PostUpdate
  @PostPersist
  public void validateOnPostLifecycle() {
    validate();
  }

  public void checkTestStatus(boolean triggerValidation) {
    boolean isValid = isValid(triggerValidation);

    publish = publish && isValid;

    // Compare with the previous status
    if (status == TestStatus.DRAFT) {
      if (!isValid) {
        status = TestStatus.INVALID;
      } else if (publish) {
        status = TestStatus.PUBLISHED;
      }
    } else if (status == TestStatus.PUBLISHED) {
      if (publish) {
        // Do nothing. It is already published
      } else if (isValid) {
        status = TestStatus.EDITED;
      } else {
        status = TestStatus.INVALID;
      }
    } else if (status == TestStatus.INVALID) {
      if (publish) {
        status = TestStatus.PUBLISHED;
      } else if (isValid && publishedAt == null) {
        status = TestStatus.DRAFT;
      } else if (isValid) {
        status = TestStatus.EDITED;
      }
    } else if (status == TestStatus.EDITED) {
      if (publish) {
        status = TestStatus.PUBLISHED;
      } else if (isValid) {
        // Do nothing. It is already edited
      } else {
        status = TestStatus.INVALID;
      }
    } else if (status == TestStatus.ARCHIVED) {
      // Do nothing. This state is only used for archived tests. It must be manually changed
    }
  }

  @Transactional
  public TestDraft validate() {
    // Clear all previous feedback
    publicationFeedback.clear();

    // If there are no questions, the test is invalid
    if (this.questions.isEmpty()) {
      TestPublicationFeedback feedback = new TestPublicationFeedback();
      feedback.setType(TestPublicationFeedbackType.EMPTY_TEST);
      feedback.setSeverity(PublicationFeedbackSeverity.ERROR);
      feedback.addKey(key);

      publicationFeedback.add(feedback);
    }

    // At least one option must be set - Points or Percentage
    if (pointsToPass == null && percentageToPass == null) {
      TestPublicationFeedback feedback = new TestPublicationFeedback();
      feedback.setType(TestPublicationFeedbackType.NO_POINTS_OR_PERCENTAGE);
      feedback.setSeverity(PublicationFeedbackSeverity.ERROR);
      feedback.addKey(key);

      publicationFeedback.add(feedback);
    }

    getQuestions().forEach(QuestionDraft::validate);

    return this;
  }

  public boolean isValid(boolean triggerValidation) {
    if (triggerValidation) {
      validate();
    }

    if (publicationFeedback.stream().anyMatch(feedback -> feedback.getSeverity() == PublicationFeedbackSeverity.ERROR)) {
      return false;
    }

    return getQuestions().stream().allMatch(questionDraft -> questionDraft.isValid(false));
  }

  public boolean isInvalid(boolean triggerValidation) {
    return !isValid(triggerValidation);
  }
}
