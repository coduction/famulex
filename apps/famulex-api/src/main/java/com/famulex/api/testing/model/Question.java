package com.famulex.api.testing.model;

import com.famulex.api.authoring.testing.model.QuestionDraft;
import com.famulex.api.authoring.testing.model.QuestionType;
import com.famulex.api.core.model.PublicKeyWithoutHistory;
import com.famulex.api.testing.execution.model.TestExecutionQuestion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@Entity
@Table(name = "fx_question")
public class Question extends PublicKeyWithoutHistory {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_question_draft")
  private QuestionDraft questionDraft;

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_test_section", nullable = false)
  private Section section;

  @Column(name = "version", nullable = false)
  private Integer version;

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
  @Column(name = "review_manually", nullable = false)
  private Boolean reviewManually = false;
  @Column(name = "shuffle_answers", nullable = false)
  private Boolean shuffleAnswers = false;
  @Column(name = "shown_answers")
  private Integer shownAnswers;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Answer> answers = new ArrayList<>();

  @OneToMany(mappedBy = "question")
  private List<TestExecutionQuestion> testExecutionQuestions = new ArrayList<>();

  public boolean isDifferent(Question question) {
    if (question == null) {
      return true;
    }

    if (!Objects.equals(question.getPosition(), this.getPosition())) {
      return true;
    } else if (!Objects.equals(question.getType(), this.getType())) {
      return true;
    } else if (!Objects.equals(question.isRequired(), this.isRequired())) {
      return true;
    } else if (!Objects.equals(question.getTitle(), this.getTitle())) {
      return true;
    } else if (!Objects.equals(question.getDescription(), this.getDescription())) {
      return true;
    } else if (!Objects.equals(question.getQuestion(), this.getQuestion())) {
      return true;
    } else if (!Objects.equals(question.getShownAnswers(), this.getShownAnswers())) {
      return true;
    } else if (!Objects.equals(question.getReviewManually(), this.getReviewManually())) {
      return true;
    } else if (!Objects.equals(question.getPoints(), this.getPoints())) {
      return true;
    } else if (!Objects.equals(question.getDeductionWrongAnswer(), this.getDeductionWrongAnswer())) {
      return true;
    } else if (!Objects.equals(question.getShuffleAnswers(), this.getShuffleAnswers())) {
      return true;
    }

    if (question.getAnswers().size() != this.getAnswers().size()) {
      return true;
    }

    for (int i = 0; i < question.getAnswers().size(); i++) {
      if (question.getAnswers().get(i).isDifferent(this.getAnswers().get(i))) {
        return true;
      }
    }

    return false;
  }

  public void setVersion(Integer version) {
    this.version = version;
    this.answers.forEach(answer -> answer.setVersion(version));
  }
}
