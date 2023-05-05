package com.famulex.api.testing.model;

import com.famulex.api.authoring.testing.model.AnswerDraft;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.testing.execution.model.TestExecutionAnswer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "fx_answer")
public class Answer extends PublicKey {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_answer_draft")
  private AnswerDraft answerDraft;

  @Column(name = "version", nullable = false)
  private Integer version;

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_question", nullable = false)
  private Question question;

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


  @OneToMany(mappedBy = "answer")
  private Set<TestExecutionAnswer> testExecutionAnswers = new LinkedHashSet<>();

  public boolean isDifferent(Answer answer) {
    if (answer == null) {
      return true;
    }

    if (!Objects.equals(answer.getPosition(), this.getPosition())) {
      return true;
    } else if (!Objects.equals(answer.getTitle(), this.getTitle())) {
      return true;
    } else if (!Objects.equals(answer.getDescription(), this.getDescription())) {
      return true;
    } else if (!Objects.equals(answer.getContent(), this.getContent())) {
      return true;
    } else if (!Objects.equals(answer.isCorrect(), this.isCorrect())) {
      return true;
    } else if (!Objects.equals(answer.isRequired(), this.isRequired())) {
      return true;
    }

    return false;
  }

}
