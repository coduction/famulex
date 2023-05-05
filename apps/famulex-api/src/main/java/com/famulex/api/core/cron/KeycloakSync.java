package com.famulex.api.core.cron;

import com.famulex.api.security.SecurityService;
import com.famulex.api.user.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

/**
 * Class CronJobs
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.06.22
 */
@Log4j2
@RequiredArgsConstructor
@Component
public class KeycloakSync {

  private final UserService userService;
  private final SecurityService securityService;

  @PostConstruct
  public void init() {
    securityService.syncRolesAndRights();
    userService.syncUsers();
  }

}
