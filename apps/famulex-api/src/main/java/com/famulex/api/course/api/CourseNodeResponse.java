package com.famulex.api.course.api;

import com.famulex.api.course.model.CourseNodeType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

/**
 * Class CourseNodeResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Getter
@Setter
@Schema(name = "CourseNode")
public class CourseNodeResponse implements Comparable<CourseNodeResponse> {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;

  private UUID parentKey;

  @NotNull
  private CourseNodeType type;
  @NotNull
  private Integer position;
  @NotNull
  private String title;
  private String description;
  private Integer estimatedTime;

  @Override
  public int compareTo(CourseNodeResponse otherNodeResponse) {
    // Sort by parentKey nulls first and then by position
    if (Objects.isNull(parentKey) && Objects.nonNull(otherNodeResponse.getParentKey())) {
      return -1;
    } else if (Objects.nonNull(parentKey) && Objects.isNull(otherNodeResponse.getParentKey())) {
      return 1;
    } else {
      return position.compareTo(otherNodeResponse.getPosition());
    }
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof CourseNodeResponse that)) return false;
    return getKey().equals(that.getKey());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getKey());
  }
}
