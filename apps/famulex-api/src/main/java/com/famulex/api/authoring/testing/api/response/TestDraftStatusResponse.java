package com.famulex.api.authoring.testing.api.response;

import com.famulex.api.authoring.testing.model.TestPublicationFeedback;
import com.famulex.api.authoring.testing.model.TestStatus;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

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
public class TestDraftStatusResponse {

  @NotNull
  private UUID key;

  @NotNull
  private TestStatus status;

  @NotNull
  @ArraySchema
  private List<TestPublicationFeedback> publicationFeedback = new ArrayList<>();
}
