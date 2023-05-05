package com.famulex.api.testing.api.request;

import com.famulex.api.authoring.testing.model.TestExecutionMode;
import lombok.Getter;
import lombok.Setter;

/**
 * Class TestConfigurationRequest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.04.23
 */
@Getter
@Setter
public class TestConfigurationRequest {

  private TestExecutionMode executionMode;
  private Double pointsToPass;
  private Double percentageToPass;
  private Integer duration;
  private boolean shuffleQuestions;
  private Integer shownQuestions;

}
