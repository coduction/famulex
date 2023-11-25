package com.famulex.api.testing.api.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class SectionDraftResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 25.10.23
 */
@Getter
@Setter
@Schema(name = "Section")
public class SectionResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;

  private UUID parentKey;
  @NotNull
  private Integer position;

  @NotNull
  private String title;
  private String description;
}
