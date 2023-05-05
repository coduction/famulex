package com.famulex.api.authoring.course.model;

import com.famulex.api.core.model.Positionable;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.core.model.PublicationFeedbackSeverity;
import com.famulex.api.course.model.CourseNode;
import com.famulex.api.course.model.CourseNodeType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Class CourseNode
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@NamedEntityGraph(
  name = "CourseDraftNode.Items",
  attributeNodes = @NamedAttributeNode(value = "items", subgraph = "Items.FilePermissions"),
  subgraphs = @NamedSubgraph(name = "Items.FilePermissions", attributeNodes = @NamedAttributeNode(value = "filePermissions"))
)
@Table(name = "fx_course_draft_node")
public class CourseDraftNode extends PublicKey implements Positionable {

  @Setter
  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false, updatable = false)
  private CourseNodeType type;

  @Setter
  @Column(name = "title")
  private String title;

  @Setter
  @Column(name = "description")
  private String description;

  @Setter
  @Column(name = "estimated_time")
  private Integer estimatedTime;

  @Setter
  @Column(name = "position", nullable = false)
  private Integer position;

  @Setter
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_parent")
  private CourseDraftNode parent;

  @Builder.Default
  @OrderBy("position ASC")
  @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseDraftNode> children = new ArrayList<>();

  @Setter
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course_draft", nullable = false, updatable = false)
  private CourseDraft courseDraft;

  @Builder.Default
  @OrderBy("position ASC")
  @OneToMany(mappedBy = "node", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseDraftItem> items = new ArrayList<>();

  @Setter
  @OneToOne(mappedBy = "draftNode", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  private CourseNode publishedNode;

  @Transient
  @Builder.Default
  private List<CoursePublicationFeedback> publicationFeedback = new ArrayList<>();

  @PreRemove
  public void preRemove() {
    if (publishedNode != null) {
      publishedNode.setDraftNode(null);
    }
  }

  @Transactional
  public void validate() {
    // Set updatedAt to now in order to show the validation errors
    // updatedAt = OffsetDateTime.now();

    // Delete all existing publication feedback
    publicationFeedback.clear();

    // Validate node
    switch (type) {
      case CHAPTER:
        if (children.size() == 0) {
          CoursePublicationFeedback feedback = new CoursePublicationFeedback();
          feedback.setKey(key);
          feedback.setType(CoursePublicationFeedbackType.EMPTY_CHAPTER);
          feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

          publicationFeedback.add(feedback);
        }

        if (items.size() > 0) {
          CoursePublicationFeedback feedback = new CoursePublicationFeedback();
          feedback.setKey(key);
          feedback.setType(CoursePublicationFeedbackType.CHAPTER_WITH_ITEMS);
          feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

          publicationFeedback.add(feedback);
        }

        break;
      case QUIZ:
        // TODO Implement validation for quiz
        break;
      default:
        if (items.size() == 0) {
          CoursePublicationFeedback feedback = new CoursePublicationFeedback();
          feedback.setKey(key);
          feedback.setType(CoursePublicationFeedbackType.EMPTY_NODE);
          feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

          publicationFeedback.add(feedback);
        }
    }

    // Validate all items
    getItems().stream()
      .sorted(Comparator.comparing(CourseDraftItem::getPosition))
      .forEach(item -> item.validate(this));

    // Validate all children
    getChildren().stream()
      .sorted(Comparator.comparing(CourseDraftNode::getPosition))
      .forEach(CourseDraftNode::validate);

    // Add feedback to parent
    addFeedbackToParent();

    // Add feedback to course draft
    addFeedbackToCourse();
  }

  private void addFeedbackToParent() {
    // If this node has no parent, return
    if (parent == null) {
      return;
    }

    // If there is no feedback, return
    if (publicationFeedback.isEmpty()) {
      return;
    }

    // If there is any feedback of type ERROR, add it to the node and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.ERROR)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.CHILD_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

      parent.getPublicationFeedback().add(feedback);
      return;
    }

    // If there is any feedback of type WARNING, add it to the node and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.WARNING)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.CHILD_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.WARNING);

      parent.getPublicationFeedback().add(feedback);
      return;
    }

    // If there is any feedback of type INFO, add it to the node and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.INFO)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.CHILD_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.INFO);

      parent.getPublicationFeedback().add(feedback);
    }
  }

  public void addFeedbackToCourse() {
    // Only add feedback to course, if this is a root node
    if (parent != null) {
      return;
    }

    // If there is no feedback, return
    if (publicationFeedback.isEmpty()) {
      return;
    }

    // If there is any feedback of type ERROR, add it to the course draft and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.ERROR)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.NODE_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

      courseDraft.getPublicationFeedback().add(feedback);
      return;
    }

    // If there is any feedback of type WARNING, add it to the course draft and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.WARNING)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.NODE_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.WARNING);

      courseDraft.getPublicationFeedback().add(feedback);
      return;
    }

    // If there is any feedback of type INFO, add it to the course draft and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.INFO)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.NODE_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.INFO);

      courseDraft.getPublicationFeedback().add(feedback);
    }
  }

  public boolean isValid(boolean triggerValidation) {
    if (triggerValidation) {
      validate();
    }

    // Check if there are any errors in this node
    if (publicationFeedback.stream().anyMatch(feedback -> feedback.getSeverity() == PublicationFeedbackSeverity.ERROR)) {
      return false;
    }

    // Check if there are any errors in the children
    if (children.stream().anyMatch(node -> node.isInvalid(false))) {
      return false;
    }

    // Check if there are any errors in the items
    return items.stream().noneMatch(item -> item.isInvalid(false));
  }

  public boolean isInvalid(boolean triggerValidation) {
    return !isValid(triggerValidation);
  }

}
