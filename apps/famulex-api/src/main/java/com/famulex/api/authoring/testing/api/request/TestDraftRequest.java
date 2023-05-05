package com.famulex.api.authoring.testing.api.request;

import com.famulex.api.authoring.testing.model.TestExecutionMode;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Class TestDraftResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
public class TestDraftRequest {

  @NotNull
  private String title;
  private String description;
  private String author;

  // The following values are default configurations for the test
  @NotNull
  private TestExecutionMode executionMode;
  private Double pointsToPass;
  private Double percentageToPass;
  private Integer duration;
  private Boolean shuffleQuestions;
  private Integer shownQuestions;

}
