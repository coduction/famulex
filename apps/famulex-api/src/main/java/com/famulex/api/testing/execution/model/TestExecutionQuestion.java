package com.famulex.api.testing.execution.model;

import com.famulex.api.core.model.UpdatedAt;
import com.famulex.api.testing.model.Question;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "fx_test_execution_question")
public class TestExecutionQuestion extends UpdatedAt {

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_question", nullable = false)
  private Question question;

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_test_execution", nullable = false)
  private TestExecution testExecution;

  @Column(name = "position", nullable = false)
  private Integer position;

  @Column(name = "points")
  private Double points;

  @OneToMany(mappedBy = "testExecutionQuestion")
  private Set<TestExecutionAnswer> testExecutionAnswers = new LinkedHashSet<>();

}
