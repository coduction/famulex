package com.famulex.api.testing.execution.model;

import com.famulex.api.core.model.UpdatedAt;
import com.famulex.api.testing.model.Section;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "fx_test_execution_section")
public class TestExecutionSection extends UpdatedAt {

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_test_section", nullable = false)
  private Section section;

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_test_execution", nullable = false)
  private TestExecution testExecution;

  @Column(name = "position", nullable = false)
  private Integer position;

  @Column(name = "points")
  private Double points;

  @OneToMany(mappedBy = "testExecutionSection")
  private Set<TestExecutionQuestion> testExecutionQuestions;

}
