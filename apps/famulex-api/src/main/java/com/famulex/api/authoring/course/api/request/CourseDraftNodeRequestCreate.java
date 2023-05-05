package com.famulex.api.authoring.course.api.request;

import com.famulex.api.course.model.CourseNodeType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Class CourseDraftNodeResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Getter
@Setter
public class CourseDraftNodeRequestCreate {

  private UUID parentKey;
  private Integer position;
  @NotNull
  private CourseNodeType type;
  @NotNull
  private String title;
  private String description;
  private Integer estimatedTime;
}
