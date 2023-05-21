package com.famulex.api.security.api.request;

import com.famulex.api.security.model.Right;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

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

  @NotEmpty
  private List<Right> rights;
}
