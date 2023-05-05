package com.famulex.api.authoring.course.model;

import com.famulex.api.core.model.Positionable;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.core.model.PublicationFeedbackSeverity;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.course.model.CourseItemType;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.testing.execution.model.TestConfiguration;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.internal.util.StringHelper;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Class CourseItem
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fx_course_draft_item")
public class CourseDraftItem extends PublicKey implements Positionable {

  @Setter
  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private CourseItemType type;

  @Setter
  @Column(name = "position", nullable = false)
  private Integer position;

  @Setter
  @Column(name = "content")
  private String content;

  @OneToOne(mappedBy = "courseDraftItem")
  private TestConfiguration testConfiguration;

  @Builder.Default
  @Fetch(FetchMode.JOIN)
  @OrderBy("position ASC")
  @OneToMany(mappedBy = "courseDraftItem", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private List<FilePermission> filePermissions = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "fk_course_draft_node", nullable = false)
  private CourseDraftNode node;

  @Setter
  @OneToOne(mappedBy = "draftItem", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  private CourseItem publishedItem;


  @Transient
  @Builder.Default
  private List<CoursePublicationFeedback> publicationFeedback = new ArrayList<>();

  @PreRemove
  public void preRemove() {
    if (publishedItem != null) {
      publishedItem.setDraftItem(null);
    }

    if (testConfiguration != null) { // TODO Check if no tests were executed and if so, delete the test configuration
      testConfiguration.setCourseDraftItem(null);
    }
  }

  @Transactional
  public void validate(CourseDraftNode node) {
    // Set updatedAt to now in order to show the validation errors
    // updatedAt = OffsetDateTime.now();

    // Delete all existing publication feedback
    publicationFeedback.clear();

    switch (type) {
      case TEXT:
        if (StringHelper.isBlank(content)) {
          CoursePublicationFeedback feedback = new CoursePublicationFeedback();
          feedback.setKey(key);
          feedback.setType(CoursePublicationFeedbackType.NO_TEXT);
          feedback.setSeverity(PublicationFeedbackSeverity.WARNING);

          publicationFeedback.add(feedback);
        }
        break;

      case VIDEO:
        if (filePermissions.isEmpty()) {
          CoursePublicationFeedback feedback = new CoursePublicationFeedback();
          feedback.setKey(key);
          feedback.setType(CoursePublicationFeedbackType.NO_VIDEO);
          feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

          publicationFeedback.add(feedback);
        }
        break;

      case PDF:
        if (filePermissions.isEmpty()) {
          CoursePublicationFeedback feedback = new CoursePublicationFeedback();
          feedback.setKey(key);
          feedback.setType(CoursePublicationFeedbackType.NO_PDF);
          feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

          publicationFeedback.add(feedback);
        }
        break;

      case QUIZ:
        // TODO Implement quiz validation
    }

    // Add potential publication feedback to the node
    addFeedbackToNode(node); // TODO Check if this is possible without passing the node
  }

  private void addFeedbackToNode(CourseDraftNode node) {
    // If there is no feedback, return
    if (publicationFeedback.isEmpty()) {
      return;
    }

    // If there is any feedback of type ERROR, add it to the node and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.ERROR)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.ITEM_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.ERROR);

      node.getPublicationFeedback().add(feedback);
      return;
    }

    // If there is any feedback of type WARNING, add it to the node and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.WARNING)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.ITEM_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.WARNING);

      node.getPublicationFeedback().add(feedback);
      return;
    }

    // If there is any feedback of type INFO, add it to the node and return
    if (publicationFeedback.stream().anyMatch(item -> item.getSeverity() == PublicationFeedbackSeverity.INFO)) {
      CoursePublicationFeedback feedback = new CoursePublicationFeedback();
      feedback.setKey(key);
      feedback.setType(CoursePublicationFeedbackType.ITEM_FEEDBACK);
      feedback.setSeverity(PublicationFeedbackSeverity.INFO);

      node.getPublicationFeedback().add(feedback);
    }
  }

  @Transactional
  public boolean isValid(boolean triggerValidation) {
    if (triggerValidation) {
      validate(node);
    }

    // Check if there are any errors
    return publicationFeedback
      .stream()
      .noneMatch(feedback -> feedback.getSeverity() == PublicationFeedbackSeverity.ERROR);
  }

  @Transactional
  public boolean isInvalid(boolean triggerValidation) {
    return !isValid(triggerValidation);
  }

  public void setNode(CourseDraftNode node) {
    this.node = node;
    node.getItems().add(this);
  }
}
