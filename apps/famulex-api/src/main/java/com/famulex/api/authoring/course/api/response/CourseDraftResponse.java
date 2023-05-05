package com.famulex.api.authoring.course.api.response;

import com.famulex.api.authoring.course.model.CoursePublicationFeedback;
import com.famulex.api.course.model.CourseStatus;
import com.famulex.api.file.api.FilePermissionResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Class CourseDraftResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Getter
@Setter
@Schema(name = "CourseDraft")
public class CourseDraftResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;
  private OffsetDateTime deletedAt;
  private OffsetDateTime publishedAt;
  private OffsetDateTime archivedAt;

  @NotNull
  private CourseStatus status;
  @NotNull
  private String title;
  private String description;
  private String author;

  @NotNull
  @ArraySchema
  private List<FilePermissionResponse> filePermissions = new ArrayList<>();

  @NotNull
  @ArraySchema
  private List<CoursePublicationFeedback> publicationFeedback = new ArrayList<>();
}
