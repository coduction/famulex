package com.famulex.api.user;

import com.famulex.api.core.util.SecurityHelper;
import com.famulex.api.security.model.Rights;
import com.famulex.api.user.api.UserMapper;
import com.famulex.api.user.api.UserRequest;
import com.famulex.api.user.api.UserResponse;
import com.famulex.api.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.jooq.DSLContext;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

/**
 * Class UserController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Log4j2
@RequiredArgsConstructor
@Tag(name = "User")
@RestController
@RequestMapping("/users")
public class UserController {

  private final UserRepository userRepository;
  private final UserService userService;
  private final UserMapper userMapper;

  private final DSLContext dsl;

  @GetMapping
  @Operation(summary = "Load users and filter by keyword")
  public Page<UserResponse> loadUsers(@ParameterObject Pageable pagination,
                                      @RequestParam(required = false) String search) {
    return userRepository.search(search, pagination)
      .map(userMapper::map);
  }

  @GetMapping("/{userKey}")
  public Optional<UserResponse> loadUser(@PathVariable UUID userKey) {
    return userRepository.findByKey(userKey).map(userMapper::toUserResponse);
  }

  @Operation(summary = "Create a new user")
  @Secured(Rights.MANAGE_USERS)
  @PostMapping
  public UserResponse createUser(UserRequest userRequest) {
    return userMapper.toUserResponse(userService.createUser(userRequest));
  }

  @Operation(summary = "Update a user")
  @Secured(Rights.MANAGE_USERS)
  @PutMapping("/{userKey}")
  public UserResponse updateUser(@PathVariable UUID userKey, UserRequest userRequest) {
    return userMapper.toUserResponse(userService.updateUser(userKey, userRequest));
  }

  @Operation(summary = "Delete a user")
  @Secured(Rights.MANAGE_USERS)
  @DeleteMapping("/{userKey}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUser(@PathVariable UUID userKey) {
    userService.deleteUser(userKey);
  }

  @Operation(summary = "Set last active date")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PutMapping("/last-active")
  public void updateLatestActivity() {
    userService.updateLatestActivity(SecurityHelper.getCurrentUserKey());
  }


  @Operation(summary = "Sync users with Keycloak")
  @Secured(Rights.SYNC_KEYCLOAK)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PostMapping("/sync")
  public void syncUsers() {
    log.info("Received update from Keycloak - Sync users");

    userService.syncUsers();
  }
}
