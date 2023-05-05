package com.famulex.api.testing.execution.model;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.authoring.testing.model.TestExecutionMode;
import com.famulex.api.core.model.DeletedAt;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.testing.model.Test;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "fx_test_configuration")
public class TestConfiguration extends DeletedAt {

  @Column(name = "archived_at")
  private OffsetDateTime archivedAt;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private ConfigurationType type;

  @ManyToOne
  @JoinColumn(name = "fk_course_draft")
  private CourseDraft courseDraft;

  @OneToOne
  @JoinColumn(name = "fk_course_draft_item")
  private CourseDraftItem courseDraftItem;

  @ManyToOne
  @JoinColumn(name = "fk_course")
  private Course course;

  @OneToOne
  @JoinColumn(name = "fk_course_item")
  private CourseItem courseItem;

  @ManyToOne(optional = false)
  @JoinColumn(name = "fk_test", nullable = false)
  private Test test;

  @Column(name = "valid_from")
  private OffsetDateTime validFrom;

  @Column(name = "valid_until")
  private OffsetDateTime validUntil;

  @Column(name = "result_from")
  private OffsetDateTime resultFrom;

  @Column(name = "result_until")
  private OffsetDateTime resultUntil;

  @Enumerated(EnumType.STRING)
  @Column(name = "execution_mode", nullable = false)
  private TestExecutionMode executionMode;
  @Column(name = "repeatable", nullable = false)
  private Boolean repeatable = false;
  @Column(name = "max_attempts")
  private Integer maxAttempts;
  @Column(name = "points_to_pass")
  private Double pointsToPass;
  @Column(name = "percentage_to_pass")
  private Double percentageToPass;
  @Column(name = "duration")
  private Integer duration;
  @Column(name = "shuffle_questions", nullable = false)
  private boolean shuffleQuestions;
  @Column(name = "shown_questions")
  private Integer shownQuestions;

  @OneToMany(mappedBy = "testConfiguration")
  private Set<TestExecution> testExecutions = new LinkedHashSet<>();

}
