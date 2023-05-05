package com.famulex.api.course.api;

import com.famulex.api.course.model.CourseItemType;
import com.famulex.api.file.api.FilePermissionResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Class CourseItemResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Getter
@Setter
@Schema(name = "CourseItem")
public class CourseItemResponse implements Comparable<CourseItemResponse> {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;

  @NotNull
  private CourseItemType type;
  @NotNull
  private Integer position;
  private String content;

  @NotNull
  @ArraySchema
  private List<FilePermissionResponse> filePermissions = new ArrayList<>();

  @Override
  public int compareTo(CourseItemResponse otherItemResponse) {
    return position.compareTo(otherItemResponse.getPosition());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof CourseItemResponse that)) return false;
    return getKey().equals(that.getKey());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getKey());
  }

}
