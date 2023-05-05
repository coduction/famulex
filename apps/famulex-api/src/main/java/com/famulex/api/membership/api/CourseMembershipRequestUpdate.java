package com.famulex.api.membership.api;

import com.famulex.api.membership.model.CourseRole;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * Class CourseMembershipResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.12.22
 */
@Getter
@Setter
public class CourseMembershipRequestUpdate {

  private OffsetDateTime validUntil;
  private OffsetDateTime validFrom;

  private CourseRole role;
}
