package com.famulex.api.course.api;

import com.famulex.api.course.model.CourseProgressType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class CourseProgress
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 16.12.22
 */
@Getter
@Setter
@Schema(name = "CourseProgress")
public class CourseProgressResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;

  @NotNull
  private CourseProgressType type;
  private UUID courseKey;
  private UUID nodeKey;
  private UUID itemKey;

  @NotNull
  private Integer percentage;
  @NotNull
  private Boolean completed;
  private Integer levelsTotal;
  private Integer levelsCompleted;
}
