package com.famulex.api.course.model;

import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.testing.execution.model.TestConfiguration;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Class CourseItem
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@Getter
@Entity
@Table(name = "fx_course_item")
public class CourseItem extends PublicKey {

  @Setter
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course_draft_item")
  private CourseDraftItem draftItem;

  @Setter
  @ManyToOne
  @JoinColumn(name = "fk_course_node", nullable = false)
  private CourseNode node;

  @Setter
  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private CourseItemType type;

  @Setter
  @Column(name = "position", nullable = false)
  private int position;

  @Setter
  @Column(name = "content")
  private String content;

  @OneToOne(mappedBy = "courseItem")
  private TestConfiguration testConfiguration;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "courseItem", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FilePermission> filePermissions = new ArrayList<>();

  @OneToMany(mappedBy = "courseItem", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseProgress> progresses = new ArrayList<>();

//    public void setNode(CourseNode node) {
//        node.getItems().add(this);
//        this.node = node;
//    }

  @PreRemove
  public void preRemove() {
//        if (node != null) {
//            node.getItems().remove(this);
//        }

    if (testConfiguration != null) { // TODO Test config cleanup
      testConfiguration.setCourseItem(null);
    }
  }
}
