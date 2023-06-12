package com.famulex.api.security.api.response;

import com.famulex.api.core.model.MembershipType;
import com.famulex.api.group.api.GroupResponse;
import com.famulex.api.security.model.RoleAssignment;
import com.famulex.api.user.api.UserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class RoleAssignmentResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 20.05.23
 */
@Getter
@Setter
@Schema(name = "RoleAssignment")
public class RoleAssignmentResponse {

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
  private RoleAssignment.Status status;
  @NotNull
  private RoleResponse role;

  @NotNull
  private MembershipType type;
  private UserResponse user;
  private GroupResponse group;
}
