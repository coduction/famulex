package com.famulex.api.authoring.course.api.response;

import com.famulex.api.authoring.course.model.CoursePublicationFeedback;
import com.famulex.api.course.model.CourseNodeType;
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
 * Class CourseDraftNodeResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Getter
@Setter
@Schema(name = "CourseDraftNode")
public class CourseDraftNodeResponse implements Comparable<CourseDraftNodeResponse> {

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

  @NotNull
  @ArraySchema
  private List<CoursePublicationFeedback> publicationFeedback = new ArrayList<>();

  @Override
  public int compareTo(CourseDraftNodeResponse otherNodeResponse) {
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
    if (!(o instanceof CourseDraftNodeResponse that)) return false;
    return getKey().equals(that.getKey());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getKey());
  }
}
