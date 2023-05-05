package com.famulex.api.authoring.testing.model;

import com.famulex.api.authoring.testing.util.TestDraftHelper;
import com.famulex.api.core.model.Positionable;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.core.model.PublicationFeedbackSeverity;
import com.famulex.api.testing.model.Answer;
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
@Table(name = "fx_answer_draft")
public class AnswerDraft extends PublicKey implements Positionable {

  @Column(name = "published_at")
  private OffsetDateTime publishedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_question_draft", nullable = false)
  private QuestionDraft questionDraft;

  @Column(name = "position", nullable = false)
  private Integer position;
  @Column(name = "required", nullable = false)
  private boolean required;
  @Column(name = "correct", nullable = false)
  private boolean correct;

  @Column(name = "title")
  private String title;
  @Column(name = "description")
  private String description;
  @Column(name = "content", nullable = false)
  private String content;

  @OrderBy("version DESC")
  @OneToMany(mappedBy = "answerDraft")
  private List<Answer> publishedAnswers = new ArrayList<>();

  @Transient
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();

  @PreRemove
  public void preRemove() {
    publishedAnswers.forEach(answer -> answer.setAnswerDraft(null));
  }

  //    @PostLoad
  @PostUpdate
  @PostPersist
  @Transactional
  public void validate() {
    // Clear previous feedback
    publicationFeedback.clear();

    // TODO Add validation logic

    TestDraftHelper.addFeedbackToQuestionDraft(questionDraft, this);
  }

  @Transactional
  public boolean isValid(boolean triggerValidation) {
    if (triggerValidation) {
      validate();
    }

    return publicationFeedback.stream().noneMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.ERROR);
  }

  @Transactional
  public boolean isInvalid(boolean triggerValidation) {
    return !isValid(triggerValidation);
  }

}
