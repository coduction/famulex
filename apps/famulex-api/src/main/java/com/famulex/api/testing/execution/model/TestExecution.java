package com.famulex.api.testing.execution.model;

import com.famulex.api.core.model.UpdatedAt;
import com.famulex.api.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "fx_test_execution")
public class TestExecution extends UpdatedAt {

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_test_configuration", nullable = false)
  private TestConfiguration testConfiguration;

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_user", nullable = false)
  private User user;

  @Column(name = "passed")
  private Boolean passed;

  @Column(name = "score")
  private Double score;

  @OneToMany(mappedBy = "testExecution")
  private Set<TestExecutionQuestion> testExecutionQuestions = new LinkedHashSet<>();

}
