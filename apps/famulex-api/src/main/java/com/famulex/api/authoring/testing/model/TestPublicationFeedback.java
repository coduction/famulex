package com.famulex.api.authoring.testing.model;

import com.famulex.api.core.model.PublicationFeedbackSeverity;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Class PublicationFeedback
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 12.12.22
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestPublicationFeedback {

  @NotNull
  private TestPublicationFeedbackType type;
  @NotNull
  private PublicationFeedbackSeverity severity;
  @NotNull
  private List<UUID> keys = new ArrayList<>();

  public void addKey(UUID key) {
    if (key == null || keys.contains(key)) {
      return;
    }

    keys.add(key);
  }

  public static class TestPublicationFeedbackBuilder {
    public TestPublicationFeedbackBuilder key(UUID key) {
      this.keys = new ArrayList<>();

      if (key == null) {
        return this;
      }

      this.keys.add(key);

      return this;
    }
  }
}
