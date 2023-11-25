package com.famulex.api.authoring.testing.api.request;

import com.famulex.api.authoring.testing.model.QuestionType;
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
public class QuestionDraftRequest {

  @NotNull
  private QuestionType type;
  private Integer position;
  private boolean required;

  private String title;
  private String description;
  @NotNull
  private String question;

  @NotNull
  private Double points;
  private Double deductionWrongAnswer;
  private Boolean allowEmpty;
  private Integer shownAnswers;
  @NotNull
  private Boolean shuffleAnswers;
  @NotNull
  private Boolean reviewManually;

}
