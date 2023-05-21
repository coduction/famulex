package com.famulex.api.security.api.request;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * Class RoleAssignmentRequest
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 20.05.23
 */
@Getter
@Setter
public class RoleAssignmentRequestUpdate {

  private OffsetDateTime validFrom;
  private OffsetDateTime validUntil;

}
