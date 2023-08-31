package com.famulex.api.core.util;

import com.famulex.api.jooq.Tables;
import com.famulex.api.security.model.Right;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.UUID;

/**
 * Class SecurityHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 19.01.22
 */
@Log4j2
@RequiredArgsConstructor
@Service("SecurityHelper")
public class SecurityHelper {

  private final DSLContext dsl;

  public static UUID getCurrentUserKey() {
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

      if (!authentication.isAuthenticated()) {
        throw new AuthenticationCredentialsNotFoundException("Authentication missing!");
      }

      return UUID.fromString(authentication.getName());
    } catch (IllegalArgumentException exception) {
      log.warn("UUID requested for anonymous user. Security context is most likely missing.");
      return null;
    } catch (Exception exception) {
      log.error("Security context could not be determined. This is known issue and yet to be fixed!");
      return null;
    }
  }

  public static boolean userHasRight(Right... rights) {
    return SecurityContextHolder.getContext()
      .getAuthentication()
      .getAuthorities()
      .stream()
      .anyMatch(authority -> Arrays.stream(rights)
        .anyMatch(right -> authority.getAuthority().equals(right.toString())));
  }

  public static boolean userHasNotRight(Right... rights) {
    return SecurityContextHolder.getContext()
      .getAuthentication()
      .getAuthorities()
      .stream()
      .noneMatch(authority -> Arrays.stream(rights)
        .anyMatch(right -> authority.getAuthority().equals(right.toString())));
  }

  public boolean isMyCourseMembership(UUID courseMembershipKey) {
    var currentUserKey = getCurrentUserKey();

    if (currentUserKey == null) {
      return false;
    }

    var query = Tables.FX_COURSE_MEMBERSHIP
      .join(Tables.FX_USER).on(Tables.FX_USER.ID.eq(Tables.FX_COURSE_MEMBERSHIP.FK_USER))
      .where(Tables.FX_USER.KEY.eq(currentUserKey)
        .and(Tables.FX_COURSE_MEMBERSHIP.KEY.eq(courseMembershipKey))
        .and(Tables.FX_COURSE_MEMBERSHIP.VALID_FROM.isNull()
          .or(Tables.FX_COURSE_MEMBERSHIP.VALID_FROM.lessOrEqual(DSL.currentOffsetDateTime())))
        .and(Tables.FX_COURSE_MEMBERSHIP.VALID_UNTIL.isNull()
          .or(Tables.FX_COURSE_MEMBERSHIP.VALID_UNTIL.greaterOrEqual(DSL.currentOffsetDateTime()))
        ));

    return dsl.fetchExists(query);
  }
}
