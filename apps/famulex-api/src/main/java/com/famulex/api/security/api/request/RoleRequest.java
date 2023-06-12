package com.famulex.api.security.api.request;

import com.famulex.api.security.model.Right;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

/**
 * Class RoleRequest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 20.05.23
 */
@Getter
@Setter
public class RoleRequest {

  @NotBlank
  private String name;
  private String description;

  @NotNull
  private Boolean defaultRole;

  @NotEmpty
  private List<Right> rights;
  
  private List<UUID> userKeys;
  private List<UUID> groupKeys;
}
