package com.famulex.api.authoring.testing.api.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Class QuestionDraftRequest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
public class AnswerDraftRequest {

  private Integer position;
  private boolean required;
  private boolean correct;

  private String title;
  private String description;
  @NotNull
  private String content;
}
