package com.famulex.api.authoring.course.model;

import com.famulex.api.core.model.DeletedAt;
import com.famulex.api.core.model.PublicationFeedbackSeverity;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseStatus;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.membership.model.CourseMembership;
import com.famulex.api.testing.execution.model.TestConfiguration;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Class Course
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.10.22
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@NamedEntityGraph(
//    name = "CourseDraft.Content",
//    attributeNodes = @NamedAttributeNode(value = "nodes", subgraph = "Nodes.Items.FilePermissions"),
//    subgraphs = {
//        @NamedSubgraph(name = "Nodes.Items.FilePermissions", attributeNodes = @NamedAttributeNode(value = "items")) //, subgraph = "Items.FilePermissions")),
//        // @NamedSubgraph(name = "Items.FilePermissions", attributeNodes = @NamedAttributeNode("filePermissions")),
//        // TODO Nested subgraph StackOverflow
//    }
//)
@Table(name = "fx_course_draft")
public class CourseDraft extends DeletedAt {

  @Setter
  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private CourseStatus status;

  @Setter
  @Column(name = "published_at")
  protected OffsetDateTime publishedAt;

  @Setter
  @Column(name = "title", nullable = false)
  private String title;

  @Setter
  @Column(name = "author")
  private String author;

  @Setter
  @Column(name = "description")
  private String description;

  @Builder.Default
  @OrderBy("position ASC")
  @OneToMany(mappedBy = "courseDraft", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseDraftNode> nodes = new ArrayList<>();

  @Builder.Default
  @OrderBy("position ASC")
  @OneToMany(mappedBy = "courseDraft", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  private List<FilePermission> filePermissions = new ArrayList<>();

  @OneToOne(mappedBy = "courseDraft", fetch = FetchType.LAZY)
  private Course publishedCourse;

  @Builder.Default
  @OneToMany(mappedBy = "courseDraft", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseMembership> memberships = new ArrayList<>();

  @Builder.Default
  @OneToMany(mappedBy = "courseDraft", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  private List<TestConfiguration> testConfigurations = new ArrayList<>();

  @Transient
  @Builder.Default
  private List<CoursePublicationFeedback> publicationFeedback = new ArrayList<>();

  @PreRemove
  public void preRemove() {
    testConfigurations.forEach(testConfiguration -> testConfiguration.setCourseDraft(null));
  }

  @Transactional
  public void validate() {
    // Clear all previous feedback
    publicationFeedback.clear();

    // If the course is empty, it is not valid
    if (this.nodes.isEmpty()) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setType(CoursePublicationFeedbackType.EMPTY_COURSE);
      feedback.setSeverity(PublicationFeedbackSeverity.ERROR);
      feedback.setKey(key);

      publicationFeedback.add(feedback);
      return;
    }

    // Start validation only for root nodes
    getNodes().stream()
      .filter(node -> node.getParent() == null)
      .sorted(Comparator.comparing(CourseDraftNode::getPosition))
      .forEach(CourseDraftNode::validate);
  }

  @Transactional
  public boolean isValid(boolean triggerValidation) {
    if (triggerValidation) {
      validate();
    }

    // If there is at least one error, the course is not valid
    if (publicationFeedback.stream().anyMatch(feedback -> feedback.getSeverity() == PublicationFeedbackSeverity.ERROR)) {
      return false;
    }

    // Check if all nodes are valid
    // Start validation only for root nodes
    return getNodes().stream()
      .filter(node -> node.getParent() == null)
      .allMatch(node -> node.isValid(false));
  }

  @Transactional
  public boolean isInvalid(boolean triggerValidation) {
    return !isValid(triggerValidation);
  }
}
