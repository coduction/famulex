package com.famulex.api.core.util;

import com.famulex.api.security.model.Right;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
public class SecurityHelper {

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

}
