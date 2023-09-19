package com.famulex.api.file.model;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.core.model.ValidFrom;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.group.model.Group;
import com.famulex.api.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Class File
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.11.22
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fx_file_permission")
public class FilePermission extends ValidFrom {

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false, updatable = false)
  private FilePermissionType type;

  @Column(name = "position")
  private Integer position;

  @ManyToOne
  @JoinColumn(name = "fk_file", updatable = false, nullable = false)
  private File file;

  /**************************************************************************
   * FileAccess
   *************************************************************************/
  @OneToMany(mappedBy = "filePermission", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FileAccess> fileAccesses = List.of();

  /**************************************************************************
   * Personal Access
   *************************************************************************/
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_user")
  private User user;

  /**************************************************************************
   * Group Access
   *************************************************************************/
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_group")
  private Group group;

  /**************************************************************************
   * Course Access
   *************************************************************************/
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course")
  private Course course;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course_item")
  private CourseItem courseItem;

  /**************************************************************************
   * Course Draft Access
   *************************************************************************/
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course_draft")
  private CourseDraft courseDraft;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_course_draft_item")
  private CourseDraftItem courseDraftItem;

  @PreRemove
  public void preRemove() {
//        if (file != null) {
//            file.getFilePermissions().remove(this);
//        }
//
//        if (user != null) {
//            user.getFilePermissions().remove(this);
//        }
//
//        if (group != null) {
//            group.getFilePermissions().remove(this);
//        }
//
//        if (course != null) {
//            course.getFilePermissions().remove(this);
//        }
//
//        if (courseItem != null) {
//            courseItem.getFilePermissions().remove(this);
//        }
//
//        if (courseDraft != null) {
//            courseDraft.getFilePermissions().remove(this);
//        }
//
//        if (courseDraftItem != null) {
//            courseDraftItem.getFilePermissions().remove(this);
//        }
  }

  public boolean isActive() {
    OffsetDateTime now = OffsetDateTime.now();

    // There must be no deletedAt or deletedAt must be in the future
    if (getDeletedAt() != null && getDeletedAt().isBefore(now)) {
      return false;
    }

    // If there is validFrom, it must be in the past
    if (getValidFrom() != null && getValidFrom().isAfter(now)) {
      return false;
    }

    // If there is validUntil, it must be in the future
    return getValidUntil() == null || !getValidUntil().isBefore(now);
  }
}
