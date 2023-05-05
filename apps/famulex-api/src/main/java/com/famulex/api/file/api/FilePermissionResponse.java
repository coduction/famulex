package com.famulex.api.file.api;

import com.famulex.api.file.model.FilePermissionType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class FileAccessResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Getter
@Setter
@Schema(name = "FilePermission")
public class FilePermissionResponse {

  @NotNull
  private UUID key;
  @NotNull
  private OffsetDateTime createdAt;
  @NotNull
  private OffsetDateTime updatedAt;
  private OffsetDateTime deletedAt;
  private OffsetDateTime validUntil;
  private OffsetDateTime validFrom;

  @NotNull
  public FilePermissionType type;
  private Integer position;

  @NotNull
  private FileResponse file;

}
