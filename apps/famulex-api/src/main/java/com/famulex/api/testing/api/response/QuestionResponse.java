package com.famulex.api.testing.api.response;

import com.famulex.api.authoring.testing.model.QuestionType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class QuestionResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
@Schema(name = "Question")
public class QuestionResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;
  private OffsetDateTime publishedAt;

  @NotNull
  private QuestionType type;
  @NotNull
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
