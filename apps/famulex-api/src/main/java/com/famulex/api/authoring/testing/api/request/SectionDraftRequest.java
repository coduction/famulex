package com.famulex.api.authoring.testing.api.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Class SectionDraftRequest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Getter
@Setter
public class SectionDraftRequest {

  private UUID parentKey;
  private Integer position;

  @NotNull
  private String title;
  private String description;
}
