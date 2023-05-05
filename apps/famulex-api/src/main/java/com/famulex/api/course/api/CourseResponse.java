package com.famulex.api.course.api;

import com.famulex.api.file.api.FilePermissionResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Class CourseResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Getter
@Setter
@Schema(name = "Course")
public class CourseResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;

  @NotNull
  private String title;
  private String description;
  private String author;

  @NotNull
  private List<FilePermissionResponse> filePermissions = new ArrayList<>();
}
