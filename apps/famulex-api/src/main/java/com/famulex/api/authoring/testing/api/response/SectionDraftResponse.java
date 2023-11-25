package com.famulex.api.authoring.testing.api.response;

import com.famulex.api.authoring.testing.model.TestPublicationFeedback;
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
 * Class SectionDraftResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 25.10.23
 */
@Getter
@Setter
@Schema(name = "SectionDraft")
public class SectionDraftResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;

  private UUID parentKey;
  @NotNull
  private Integer position;

  @NotNull
  private String title;
  private String description;

  @NotNull
  @ArraySchema
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();
}
