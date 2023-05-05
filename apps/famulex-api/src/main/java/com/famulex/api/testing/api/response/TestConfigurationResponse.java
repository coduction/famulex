package com.famulex.api.testing.api.response;

import com.famulex.api.authoring.testing.model.TestExecutionMode;
import com.famulex.api.testing.execution.model.ConfigurationType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class TestConfigurationResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.04.23
 */
@Getter
@Setter
@Schema(name = "TestConfiguration")
public class TestConfigurationResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;
  private OffsetDateTime deletedAt;
  private OffsetDateTime archivedAt;

  private OffsetDateTime validFrom;
  private OffsetDateTime validUntil;
  private OffsetDateTime resultFrom;
  private OffsetDateTime resultUntil;

  @NotNull
  private UUID testKey;
  private TestResponse test;

  @NotNull
  private ConfigurationType type;
  private UUID courseDraftKey;
  private UUID courseDraftItemKey;
  private UUID courseKey;
  private UUID courseItemKey;

  @NotNull
  private TestExecutionMode executionMode;
  private Double pointsToPass;
  private Double percentageToPass;
  private Integer duration;
  private boolean shuffleQuestions;
  private Integer shownQuestions;
}
