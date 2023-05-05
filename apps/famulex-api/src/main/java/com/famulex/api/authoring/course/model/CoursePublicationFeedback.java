package com.famulex.api.authoring.course.model;

import com.famulex.api.core.model.PublicationFeedbackSeverity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Class PublicationFeedback
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 12.12.22
 */
@Getter
@Setter
public class CoursePublicationFeedback {

  @NotNull
  private CoursePublicationFeedbackType type;
  @NotNull
  private PublicationFeedbackSeverity severity;
  @NotNull
  private UUID key;

}
