package com.famulex.api.security.api.request;

import com.famulex.api.core.model.MembershipType;
import com.famulex.api.security.model.RoleAssignment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class RoleAssignmentRequest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 20.05.23
 */
@Getter
@Setter
@Builder
public class RoleAssignmentRequestCreate {

  @NotNull
  private UUID roleKey;

  @NotNull
  private MembershipType type;
  private RoleAssignment.Status status;
  private OffsetDateTime validFrom;
  private OffsetDateTime validUntil;

  private UUID userKey;
  private UUID groupKey;

  @JsonIgnore
  @AssertTrue(message = "For type USER, userKey must be provided")
  public boolean isUserKeyProvided() {
    if (type == MembershipType.USER) {
      return userKey != null;
    }

    return true;
  }

  @JsonIgnore
  @AssertTrue(message = "For type GROUP, groupKey must be provided")
  public boolean isGroupKeyProvided() {
    if (type == MembershipType.GROUP) {
      return groupKey != null;
    }

    return true;
  }

  @JsonIgnore
  @AssertTrue(message = "Either user or group must be set. Not both.")
  public boolean isGroupOrUserSet() {
    return userKey != null ^ groupKey != null;
  }

  @JsonIgnore
  @AssertTrue(message = "Valid from must be before valid until")
  public boolean isValidFromBeforeValidUntil() {
    if (validFrom != null && validUntil != null) {
      return validFrom.isBefore(validUntil);
    }

    return true;
  }

  @JsonIgnore
  @AssertTrue(message = "Valid from cannot be in the past")
  public boolean isValidFromInFuture() {
    if (validFrom != null) {
      return validFrom.isAfter(OffsetDateTime.now());
    }

    return true;
  }
}
