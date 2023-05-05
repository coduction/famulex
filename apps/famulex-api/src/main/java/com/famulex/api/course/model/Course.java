package com.famulex.api.course.model;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.membership.model.CourseMembership;
import com.famulex.api.testing.execution.model.TestConfiguration;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
@Entity
//@NamedEntityGraph(
//    name = "Course.Content",
//    attributeNodes = @NamedAttributeNode(value = "nodes", subgraph = "Nodes.Items.FilePermissions"),
//    subgraphs = {
//        @NamedSubgraph(name = "Nodes.Items.FilePermissions", attributeNodes = @NamedAttributeNode(value = "items"))
//    }
//)
@Table(name = "fx_course")
public class Course extends PublicKey {

  @Setter
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course_draft", nullable = false, updatable = false)
  private CourseDraft courseDraft;

  @Setter
  @Column(name = "title", nullable = false)
  private String title;

  @Setter
  @Column(name = "description")
  private String description;

  @Setter
  @Column(name = "author")
  private String author;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseNode> nodes = new ArrayList<>();

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FilePermission> filePermissions = new ArrayList<>();

  @OneToMany(mappedBy = "course")
  private List<CourseMembership> memberships = new ArrayList<>();

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseProgress> progresses = new ArrayList<>();

  @OneToMany(mappedBy = "course", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  private List<TestConfiguration> testConfigurations = new ArrayList<>();

  // Only used for easier mapping
  @Transient
  private CourseProgress progress;
  @Transient
  private CourseMembership membership;

  @PreRemove
  private void preRemove() {
    for (TestConfiguration testConfiguration : testConfigurations) {
      testConfiguration.setCourse(null);
    }
  }

  public void addNode(CourseNode node) {
    nodes.add(node);
    node.setCourse(this);
  }
}
