package com.famulex.api.membership.api;

import com.famulex.api.authoring.course.api.response.CourseDraftResponse;
import com.famulex.api.course.api.CourseProgressResponse;
import com.famulex.api.course.api.CourseResponse;
import com.famulex.api.group.api.GroupResponse;
import com.famulex.api.membership.model.CourseRole;
import com.famulex.api.membership.model.MembershipType;
import com.famulex.api.user.api.UserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "CourseMembership")
public class CourseMembershipResponse {

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
  private MembershipType type;
  @NotNull
  private CourseRole role;

  private UserResponse user;
  private GroupResponse group;

  private CourseResponse course;
  private CourseDraftResponse courseDraft;

  private CourseProgressResponse progress;
  private UUID lastNodeKey;
}
