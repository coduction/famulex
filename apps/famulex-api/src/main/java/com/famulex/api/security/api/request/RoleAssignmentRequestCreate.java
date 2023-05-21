package com.famulex.api.security.api.request;

import com.famulex.api.core.model.MembershipType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
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
public class RoleAssignmentRequestCreate {

  @NotNull
  private UUID roleKey;

  @NotNull
  private MembershipType type;
  private OffsetDateTime validFrom;
  private OffsetDateTime validUntil;

  private UUID userKey;
  private UUID groupKey;

  @AssertTrue(message = "For type USER, userKey must be provided")
  public boolean isUserKeyProvided() {
    if (type == MembershipType.USER) {
      return userKey != null;
    }

    return true;
  }

  @AssertTrue(message = "For type GROUP, groupKey must be provided")
  public boolean isGroupKeyProvided() {
    if (type == MembershipType.GROUP) {
      return groupKey != null;
    }

    return true;
  }

  @AssertTrue(message = "Either user or group must be set. Not both.")
  public boolean isGroupOrUserSet() {
    return userKey != null ^ groupKey != null;
  }
}
