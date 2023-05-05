package com.famulex.api.group.api;

import com.famulex.api.group.model.GroupType;
import io.smallrye.common.constraint.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Class GroupResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 05.12.22
 */
@Getter
@Setter
@Schema(name = "Group")
public class GroupResponse {

  @NotNull
  private UUID key;
  @NotNull
  private GroupType type;

  @NotNull
  private String name;
  private String description;
}
