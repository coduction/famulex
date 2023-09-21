package com.famulex.api.membership.api;

import com.famulex.api.core.model.MembershipType;
import com.famulex.api.membership.model.CourseRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Class CourseMembershipResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.12.22
 */
@Getter
@Setter
public class CourseMembershipRequestCreate {

  private OffsetDateTime validUntil;
  private OffsetDateTime validFrom;

  @NotNull
  private MembershipType type;
  @NotNull
  private CourseRole role;

  private UUID userKey;
  private UUID groupKey;

  @JsonIgnore
  @AssertTrue(message = "Either user or group must be set")
  public boolean isUserOrGroupSet() {
    return userKey != null ^ groupKey != null;
  }
}
