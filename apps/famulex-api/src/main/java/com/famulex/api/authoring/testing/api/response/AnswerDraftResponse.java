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
 * Class TestDraftResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
@Schema(name = "AnswerDraft")
public class AnswerDraftResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;
  private OffsetDateTime publishedAt;

  @NotNull
  private Integer position;
  private boolean required;
  private boolean correct;

  private String title;
  private String description;
  @NotNull
  private String content;

  @NotNull
  @ArraySchema
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();
}
