package com.famulex.api.file.api;

import com.famulex.api.user.api.UserResponse;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class FileResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Getter
@Setter
public class FileResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;
  private OffsetDateTime deletedAt;

  @NotNull
  private String url;

  private String name;
  @NotNull
  private String mimeType;
  @NotNull
  private String extension;
  @NotNull
  private Long size;
  private Integer length;

  private UserResponse creator;
}
