package com.famulex.api.authoring.course.api.request;

import com.famulex.api.course.model.CourseStatus;
import lombok.Getter;
import lombok.Setter;
import org.springdoc.core.annotations.ParameterObject;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Class CourseDraftFilter
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 24.08.23
 */
@Getter
@Setter
@ParameterObject
public class CourseDraftFilter {

  private String search;

  private boolean myCourses;
  private UUID ownerKey;

  private List<CourseStatus> statuses = new ArrayList<>();
}
