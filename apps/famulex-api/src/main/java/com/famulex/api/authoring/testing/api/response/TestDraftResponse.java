package com.famulex.api.authoring.testing.api.response;

import com.famulex.api.authoring.testing.model.TestExecutionMode;
import com.famulex.api.authoring.testing.model.TestPublicationFeedback;
import com.famulex.api.authoring.testing.model.TestStatus;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Class TestDraftResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
@Schema(name = "TestDraft")
public class TestDraftResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;
  private OffsetDateTime deletedAt;
  private OffsetDateTime archivedAt;
  private OffsetDateTime publishedAt;
  private Integer publishedVersion;

  @NotNull
  private TestStatus status;

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
  private boolean shuffleQuestions;
  private Integer shownQuestions;

  @NotNull
  @ArraySchema
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();
}
