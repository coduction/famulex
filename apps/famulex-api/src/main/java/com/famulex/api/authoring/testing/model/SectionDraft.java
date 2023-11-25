package com.famulex.api.authoring.testing.model;

import com.famulex.api.authoring.testing.util.TestDraftHelper;
import com.famulex.api.core.model.Positionable;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.core.model.PublicationFeedbackSeverity;
import com.famulex.api.testing.model.Section;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Class TestDraftSection
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 25.10.23
 */
@Getter
@Setter
@Entity
@Table(name = "fx_test_section_draft")
public class SectionDraft extends PublicKey implements Positionable {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_test_draft")
  private TestDraft testDraft;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_parent")
  private SectionDraft parent;

  @Column(name = "title", nullable = false)
  private String title;
  @Column(name = "description")
  private String description;

  @Column(name = "position", nullable = false)
  private Integer position;

  @Column(name = "shuffle_questions")
  private boolean shuffleQuestions;
  @Column(name = "shown_questions")
  private Integer shownQuestions;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<SectionDraft> sections = new ArrayList<>();

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "sectionDraft", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<QuestionDraft> questions = new ArrayList<>();

  @OrderBy("version DESC")
  @OneToMany(mappedBy = "sectionDraft")
  private List<Section> publishedSections = new ArrayList<>();

  @Transient
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();

  @PreRemove
  public void preRemove() {
    publishedSections.forEach(section -> section.setSectionDraft(null));
  }

  @PostUpdate
  @PostPersist
  public void validateOnPostLifecycle() {
    validate();
  }


  @Transactional
  public void validate() {
    // Clear all previous feedback
    publicationFeedback.clear();

    // If there are no questions, the section is invalid
    if (this.questions.isEmpty()) {
      publicationFeedback.add(TestPublicationFeedback.builder()
        .type(TestPublicationFeedbackType.EMPTY_SECTION)
        .severity(PublicationFeedbackSeverity.ERROR)
        .key(key)
        .build());
    }

    sections.forEach(SectionDraft::validate);
    questions.forEach(QuestionDraft::validate);

    // Add feedback to parent
    TestDraftHelper.addFeedbackToSectionDraft(parent, this);

    // Add feedback to test draft
    TestDraftHelper.addFeedbackToTestDraft(testDraft, this);
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
