package com.famulex.api.security;

import com.famulex.api.security.model.Right;
import com.famulex.api.security.model.Rights;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

/**
 * Class SecurityController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 16.11.22
 */
@Log4j2
@RequiredArgsConstructor
@Tag(name = "Security")
@RestController
@RequestMapping("/security")
public class SecurityController {

    private final SecurityService securityService;

    @PostMapping("/sync")
    @Operation(summary = "Sync roles and rights with Keycloak")
    @Secured(Rights.SYNC_KEYCLOAK)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void syncRights() {
        log.info("Received update from Keycloak - Sync roles and rights");

        securityService.syncRolesAndRights();
    }

    @GetMapping("/config")
    @Operation(summary = "Get an overview of the current security options")
    @Secured({Rights.SYNC_KEYCLOAK, Rights.MANAGE_USERS})
    public Right[] loadRights() {
        return Right.values();
    }
}
