package com.famulex.api.course.model;

import com.famulex.api.core.model.PublicKey;
import com.famulex.api.membership.model.CourseMembership;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Class CourseProgress
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 16.12.22
 */
@Getter
@Setter
@Entity
@Table(name = "fx_course_progress")
public class CourseProgress extends PublicKey {

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private CourseProgressType type;

  @Column(name = "progress", nullable = false)
  private Integer progress = 0;

  @Column(name = "completed", nullable = false)
  private Boolean completed = false;

  @ManyToOne
  @JoinColumn(name = "fk_membership", nullable = false, updatable = false)
  private CourseMembership membership;

  @ManyToOne
  @JoinColumn(name = "fk_course")
  private Course course;

  @ManyToOne
  @JoinColumn(name = "fk_course_node")
  private CourseNode courseNode;

  @ManyToOne
  @JoinColumn(name = "fk_course_item")
  private CourseItem courseItem;

  @Transient
  private Integer levelsTotal = 0;

  @Transient
  private Integer levelsCompleted = 0;

  @PreRemove
  public void preRemove() {
//        if (course != null) {
//            course.getProgresses().remove(this);
//        }
//        if (courseNode != null) {
//            courseNode.getProgresses().remove(this);
//        }
//        if (courseItem != null) {
//            courseItem.getProgresses().remove(this);
//        }
//        if (membership != null) {
//            membership.getCourseProgresses().remove(this);
//        }
  }

  public void addToLevels(CourseProgress progress) {
    this.levelsTotal += progress.getLevelsTotal();
    this.levelsCompleted += progress.getLevelsCompleted();
  }
}
