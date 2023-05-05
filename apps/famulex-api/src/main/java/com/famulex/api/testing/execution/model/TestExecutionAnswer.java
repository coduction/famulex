package com.famulex.api.testing.execution.model;

import com.famulex.api.core.model.UpdatedAt;
import com.famulex.api.testing.model.Answer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "fx_test_execution_answer")
public class TestExecutionAnswer extends UpdatedAt {

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_answer", nullable = false)
  private Answer answer;

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_test_execution_question", nullable = false)
  private TestExecutionQuestion testExecutionQuestion;

  @Column(name = "position", nullable = false)
  private Integer position;

  @Column(name = "selected")
  private Boolean selected;

  @Column(name = "content")
  private String content;

}
