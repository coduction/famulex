package com.famulex.api.membership.model;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.core.model.MembershipType;
import com.famulex.api.core.model.ValidFrom;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseNode;
import com.famulex.api.course.model.CourseProgress;
import com.famulex.api.group.model.Group;
import com.famulex.api.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Class Course
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.10.22
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fx_course_membership")
public class CourseMembership extends ValidFrom {

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false, updatable = false)
  private MembershipType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "role", nullable = false)
  private CourseRole role;

  @ManyToOne
  @JoinColumn(name = "fk_user", updatable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "fk_group", updatable = false)
  private Group group;

  @ManyToOne
  @JoinColumn(name = "fk_course_draft", updatable = false)
  private CourseDraft courseDraft;

  @ManyToOne
  @JoinColumn(name = "fk_course")
  private Course course;

  @ManyToOne
  @JoinColumn(name = "fk_last_course_node")
  private CourseNode lastCourseNode;

  @Builder.Default
  @OneToMany(mappedBy = "membership", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseProgress> progresses = new ArrayList<>();

  @PreRemove
  public void preRemove() {
//        if (lastCourseNode != null) {
//            lastCourseNode.getLastNodeMemberships().remove(this);
//        }
  }
}
