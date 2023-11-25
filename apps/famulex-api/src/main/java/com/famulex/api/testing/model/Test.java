package com.famulex.api.testing.model;

import com.famulex.api.authoring.testing.model.TestDraft;
import com.famulex.api.authoring.testing.model.TestExecutionMode;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.testing.execution.model.TestConfiguration;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@Entity
@Table(name = "fx_test")
public class Test extends PublicKey {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_test_draft")
  private TestDraft testDraft;

  @Column(name = "version", nullable = false)
  private Integer version;

  @Column(name = "title", nullable = false)
  private String title;
  @Column(name = "description")
  private String description;
  @Column(name = "author")
  private String author;

  @Enumerated(EnumType.STRING)
  @Column(name = "execution_mode", nullable = false)
  private TestExecutionMode executionMode;
  @Column(name = "points_to_pass")
  private Double pointsToPass;
  @Column(name = "percentage_to_pass")
  private Double percentageToPass;
  @Column(name = "duration")
  private Integer duration;
  @Column(name = "shuffle_sections")
  private boolean shuffleSections;
  @Column(name = "shuffle_questions")
  private boolean shuffleQuestions;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Section> sections = new ArrayList<>();

  @OneToMany(mappedBy = "test")
  private List<TestConfiguration> testConfigurations = new ArrayList<>();

  public boolean isDifferent(Test test) {
    if (test == null) {
      return true;
    }

    if (!Objects.equals(getTitle(), test.getTitle())) {
      return true;
    } else if (!Objects.equals(getDescription(), test.getDescription())) {
      return true;
    } else if (!Objects.equals(getAuthor(), test.getAuthor())) {
      return true;
    } else if (!Objects.equals(getExecutionMode(), test.getExecutionMode())) {
      return true;
    } else if (!Objects.equals(getPointsToPass(), test.getPointsToPass())) {
      return true;
    } else if (!Objects.equals(getPercentageToPass(), test.getPercentageToPass())) {
      return true;
    } else if (!Objects.equals(getDuration(), test.getDuration())) {
      return true;
    } else if (!Objects.equals(isShuffleSections(), test.isShuffleSections())) {
      return true;
    } else if (!Objects.equals(isShuffleQuestions(), test.isShuffleQuestions())) {
      return true;
    }

    if (sections.size() != test.sections.size()) {
      return true;
    }

    for (int i = 0; i < sections.size(); i++) {
      if (sections.get(i).isDifferent(test.sections.get(i))) {
        return true;
      }
    }

    return false;
  }

  public void setVersion(Integer version) {
    this.version = version;

    sections.forEach(section -> section.setVersion(version));
  }
}
