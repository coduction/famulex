package com.famulex.api.course.model;

import com.famulex.api.authoring.course.model.CourseDraftNode;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.membership.model.CourseMembership;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

/**
 * Class CourseNode
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@Getter
@Entity
@Table(name = "fx_course_node")
public class CourseNode extends PublicKey {

  @Setter
  @ManyToOne
  @JoinColumn(name = "fk_course", nullable = false, updatable = false)
  private Course course;

  @Setter
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course_draft_node")
  private CourseDraftNode draftNode;

  @ManyToOne
  @JoinColumn(name = "fk_parent")
  private CourseNode parent;

  @Setter
  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private CourseNodeType type;

  @Setter
  @Column(name = "position", nullable = false)
  private Integer position;

  @Setter
  @Transient
  private UUID parentKey;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseNode> children = new ArrayList<>();

  @Setter
  @Column(name = "title")
  private String title;

  @Setter
  @Column(name = "description")
  private String description;

  @Setter
  @Column(name = "estimated_time")
  private Integer estimatedTime;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "node", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseItem> items = new ArrayList<>();

  @OneToMany(mappedBy = "courseNode", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<CourseProgress> progresses = new HashSet<>();

  @OneToMany(mappedBy = "lastCourseNode")
  private Set<CourseMembership> lastNodeMemberships = new HashSet<>();

  @PreRemove
  public void preRemove() {
//        course.getNodes().remove(this);
//
    lastNodeMemberships.forEach(membership -> membership.setLastCourseNode(null));
  }

  public boolean isRoot() {
    return parent == null;
  }

  public void addItem(CourseItem item) {
    if (item == null) {
      return;
    }

    item.setNode(this);
    items.add(item);
  }

  public void setParent(CourseNode parent) {
    if (parent == null) {
      return;
    }

    parent.getChildren().add(this);
    this.parent = parent;
  }
}
