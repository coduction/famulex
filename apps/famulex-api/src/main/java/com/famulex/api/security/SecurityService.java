package com.famulex.api.security;

import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.core.model.MembershipType;
import com.famulex.api.group.model.Group;
import com.famulex.api.group.repository.GroupRepository;
import com.famulex.api.security.api.RoleMapper;
import com.famulex.api.security.api.request.RoleAssignmentRequestCreate;
import com.famulex.api.security.model.Right;
import com.famulex.api.security.model.Role;
import com.famulex.api.security.model.RoleAssignment;
import com.famulex.api.security.repository.RoleAssignmentRepository;
import com.famulex.api.security.repository.RoleRepository;
import com.famulex.api.user.model.User;
import com.famulex.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Class SecurityService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 16.11.22
 */
@Log4j2
@Service
@RequiredArgsConstructor
public class SecurityService {

  private final GroupRepository groupRepository;
  private final RoleRepository roleRepository;
  private final RoleAssignmentRepository roleAssignmentRepository;
  private final UserRepository userRepository;

  private final RealmResource keycloak;

  private final RoleMapper roleMapper;

  public List<Right> loadRightsForUser(UUID userKey) {
    return null;
  }

  public RoleAssignment createRoleAssignment(RoleAssignmentRequestCreate request) {
    Role role = roleRepository.findByKey(request.getRoleKey())
      .orElseThrow(() -> new EntityNotFoundException(Role.class, request.getRoleKey()));

    RoleAssignment assignment = roleMapper.toRoleAssignment(request);
    assignment.setRole(role);

    if (request.getType() == MembershipType.USER) {
      User user = userRepository.findByKey(request.getUserKey())
        .orElseThrow(() -> new EntityNotFoundException(User.class, request.getUserKey()));

      assignment.setUser(user);
    } else if (request.getType() == MembershipType.GROUP) {
      Group group = groupRepository.findByKey(request.getGroupKey())
        .orElseThrow(() -> new EntityNotFoundException(Group.class, request.getGroupKey()));

      assignment.setGroup(group);
    }

    return roleAssignmentRepository.save(assignment);
  }

  @Transactional
  public void syncRolesAndRights() {
    List<RoleRepresentation> remote = keycloak.roles().list(true);

    // Remove every role without fx_ prefix
    // roles.removeIf(role -> !role.getName().startsWith("fx_"));

    // Convert to map for easier handling
    Map<String, RoleRepresentation> remoteMap = remote.stream()
      .collect(Collectors.toMap(RoleRepresentation::getName, Function.identity()));

    // Load all rights, which should be existing
    List<String> localRights = Arrays.stream(Right.values())
      .map(Right::toString)
      .toList();

    // If right is already existing, remove if it
    List<String> newRights = localRights.stream()
      .filter(newRight -> !remoteMap.containsKey(newRight))
      .toList();

    // Create all remaining local rights on the server
    for (String newRight : newRights) {
      RoleRepresentation right = new RoleRepresentation();
      right.setName(newRight);

      keycloak.roles().create(right);
      log.info("Right " + newRight + " has been created on Keycloak");
    }

    // Remove all roles and rights from the server, which are not needed anymore
    remote.removeIf(role -> localRights.contains(role.getName()));
    remote.removeIf(role -> role.getName().startsWith("default-roles-"));
    remote.removeIf(role -> role.getName().equals("offline_access"));
    remote.removeIf(role -> role.getName().equals("uma_authorization"));

    for (RoleRepresentation role : remote) {
      keycloak.roles().deleteRole(role.getName());
      log.info(role.getName() + " has been removed from Keycloak");
    }

    log.info("Roles and rights sync completed");
  }
}
