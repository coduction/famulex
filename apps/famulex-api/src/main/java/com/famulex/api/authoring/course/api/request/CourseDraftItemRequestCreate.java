package com.famulex.api.authoring.course.api.request;

import com.famulex.api.course.model.CourseItemType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Class CourseDraftNodeResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Getter
@Setter
public class CourseDraftItemRequestCreate {

  @NotNull
  private CourseItemType type;
  private Integer position;
  private String content;
}
