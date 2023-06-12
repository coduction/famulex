package com.famulex.api.security;

import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.core.model.MembershipType;
import com.famulex.api.core.util.SecurityHelper;
import com.famulex.api.group.api.GroupMapper;
import com.famulex.api.group.model.Group;
import com.famulex.api.group.repository.GroupRepository;
import com.famulex.api.security.api.RoleMapper;
import com.famulex.api.security.api.request.RoleAssignmentRequestCreate;
import com.famulex.api.security.api.request.RoleAssignmentRequestUpdate;
import com.famulex.api.security.api.request.RoleRequest;
import com.famulex.api.security.api.response.RoleAssignmentResponse;
import com.famulex.api.security.api.response.RoleResponse;
import com.famulex.api.security.model.Right;
import com.famulex.api.security.model.Rights;
import com.famulex.api.security.model.Role;
import com.famulex.api.security.model.RoleAssignment;
import com.famulex.api.security.repository.RoleAssignmentRepository;
import com.famulex.api.security.repository.RoleRepository;
import com.famulex.api.user.api.UserMapper;
import com.famulex.api.user.model.User;
import com.famulex.api.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

  private final RoleRepository roleRepository;
  private final RoleAssignmentRepository roleAssignmentRepository;
  private final UserRepository userRepository;
  private final GroupRepository groupRepository;

  private final SecurityService securityService;

  private final RoleMapper roleMapper;
  private final GroupMapper groupMapper;
  private final UserMapper userMapper;

  @GetMapping("/config")
  @Operation(summary = "Get an overview of the current security options")
  public Right[] loadRights() {
    return Right.values();
  }

  @GetMapping("/user-rights")
  @Operation(summary = "Load the rights of the current user")
  public List<Right> loadRightsForUser() {
    // Get UUID from security context
    UUID userKey = SecurityHelper.getCurrentUserKey();

    return securityService.loadRightsForUser(userKey);
  }

  @PostMapping("/sync")
  @Operation(summary = "Sync roles and rights with Keycloak")
  @Secured(Rights.SYNC_KEYCLOAK)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void syncRights() {
    log.info("Sync roles and rights");

    securityService.syncRolesAndRights();
  }

  /*************************************************************************
   * Roles
   ************************************************************************/
  @GetMapping("/roles")
  public Page<RoleResponse> loadRoles(@ParameterObject Pageable pagination,
                                      @RequestParam(required = false) String search) {
    return roleRepository.search(search, pagination)
      .map(roleMapper::toRoleResponse);
  }

  @GetMapping("/roles/exists")
  public boolean checkRoleExistence(@RequestParam String name) {
    return roleRepository.existsByName(name);
  }

  @PostMapping("/roles")
  public RoleResponse createRole(@Valid @RequestBody RoleRequest roleRequest) {
    var role = roleRepository.save(roleMapper.toRole(roleRequest));

    securityService.syncRolesAndRights();

    roleRequest.getUserKeys().forEach(userKey -> {
      var user = userRepository.findByKey(userKey)
        .orElseThrow(() -> new EntityNotFoundException(User.class, userKey));

      var request = RoleAssignmentRequestCreate.builder()
        .roleKey(role.getKey())
        .userKey(user.getKey())
        .type(MembershipType.USER)
        .status(RoleAssignment.Status.ACTIVE)
        .build();

      securityService.createRoleAssignment(request);
    });

    roleRequest.getGroupKeys().forEach(groupKey -> {
      var group = groupRepository.findByKey(groupKey)
        .orElseThrow(() -> new EntityNotFoundException(Group.class, groupKey));

      var request = RoleAssignmentRequestCreate.builder()
        .roleKey(role.getKey())
        .groupKey(group.getKey())
        .type(MembershipType.GROUP)
        .status(RoleAssignment.Status.ACTIVE)
        .build();

      securityService.createRoleAssignment(request);
    });

    return roleMapper.toRoleResponse(role);
  }

  @PutMapping("/roles/{roleKey}")
  public RoleResponse updateRole(@PathVariable UUID roleKey, @Valid @RequestBody RoleRequest roleRequest) {
    var role = roleRepository.findByKey(roleKey)
      .orElseThrow(() -> new EntityNotFoundException(Role.class, roleKey));

    roleMapper.updateRole(roleRequest, role);
    role = roleRepository.save(role);

    securityService.syncRolesAndRights();

    return roleMapper.toRoleResponse(role);
  }

  @DeleteMapping("/roles/{roleKey}")
  public void deleteRole(@PathVariable UUID roleKey) {
    Role role = roleRepository.findByKey(roleKey)
      .orElseThrow(() -> new EntityNotFoundException(Role.class, roleKey));

    roleRepository.delete(role);

    securityService.syncRolesAndRights();
  }

  /*************************************************************************
   * Role Assignments
   ************************************************************************/
  @Transactional(readOnly = true)
  @GetMapping("/roles-assignments")
  public Page<RoleAssignmentResponse> loadRoleAssignments(@RequestParam UUID roleKey,
                                                          @RequestParam MembershipType type,
                                                          @ParameterObject Pageable pagination,
                                                          @RequestParam(required = false) String search) {

    if (!roleRepository.existsByKey(roleKey)) {
      throw new EntityNotFoundException(Role.class, roleKey);
    }

    return roleAssignmentRepository.searchAssignments(roleKey, type, search, pagination);
  }

  @Transactional
  @PostMapping("/role-assignments")
  public RoleAssignmentResponse createRoleAssignment(@Valid @RequestBody RoleAssignmentRequestCreate request) {
    var assignment = securityService.createRoleAssignment(request);

    return roleMapper.toRoleAssignmentResponse(assignment);
  }

  @Transactional
  @PutMapping("/roles-assignments/{roleAssignmentKey}")
  public RoleAssignmentResponse updateRoleAssignment(@PathVariable UUID roleAssignmentKey, @Valid @RequestBody RoleAssignmentRequestUpdate request) {
    var roleAssignment = roleAssignmentRepository.findByKey(roleAssignmentKey)
      .orElseThrow(() -> new EntityNotFoundException(RoleAssignment.class, roleAssignmentKey));

    roleMapper.updateRoleAssignment(request, roleAssignment);
    roleAssignment = roleAssignmentRepository.save(roleAssignment);

    return roleMapper.toRoleAssignmentResponse(roleAssignment);
  }

  @Transactional
  @DeleteMapping("/roles-assignments/{roleAssignmentKey}")
  public void deleteRoleAssignment(@PathVariable UUID roleAssignmentKey) {
    var roleAssignment = roleAssignmentRepository.findByKey(roleAssignmentKey)
      .orElseThrow(() -> new EntityNotFoundException(RoleAssignment.class, roleAssignmentKey));

    roleAssignmentRepository.delete(roleAssignment);
  }
}
