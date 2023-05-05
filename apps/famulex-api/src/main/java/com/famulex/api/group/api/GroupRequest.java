package com.famulex.api.group.api;

import com.famulex.api.group.model.GroupType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Class GroupRequest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Getter
@Setter
public class GroupRequest {

  @NotNull
  private GroupType type;
  @NotBlank
  private String name;
  private String description;

}
