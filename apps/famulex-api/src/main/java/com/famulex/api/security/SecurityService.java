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
import org.jobrunr.scheduling.JobScheduler;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
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

  private final JobScheduler jobScheduler;

  private final RoleMapper roleMapper;

  public List<Right> loadRightsForUser(UUID userKey) {


    jobScheduler.schedule(OffsetDateTime.parse("2023-05-24T12:37:30+02:00"), () -> System.out.println("Hello World from JobScheduler!" + userKey));


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

      addRoleToUser(assignment);
    } else if (request.getType() == MembershipType.GROUP) {
      Group group = groupRepository.findByKey(request.getGroupKey())
        .orElseThrow(() -> new EntityNotFoundException(Group.class, request.getGroupKey()));

      assignment.setGroup(group);
    }

    return roleAssignmentRepository.save(assignment);
  }

  @Transactional
  public void syncRolesAndRights() {
    var remoteRolesAndRights = keycloak.roles().list(true);
    var localRoles = roleRepository.findAll();

    // Convert to map for easier handling
    var remoteMap = remoteRolesAndRights.stream()
      .collect(Collectors.toMap(RoleRepresentation::getName, Function.identity()));

    // Load all rights, which should be existing
    var localRolesAndRights = Arrays.stream(Right.values())
      .map(Right::toString)
      .collect(Collectors.toList());

    // Load all roles, which should be existing
    localRoles.stream()
      .map(Role::getName)
      .forEach(localRolesAndRights::add);

    // If right is already existing, remove if it
    List<String> newRolesAndRights = localRolesAndRights.stream()
      .filter(newRight -> !remoteMap.containsKey(newRight))
      .toList();

    // Create all remaining local rights on the server
    for (String newRight : newRolesAndRights) {
      RoleRepresentation right = new RoleRepresentation();
      right.setName(newRight);

      keycloak.roles().create(right);
      log.info("Right " + newRight + " has been created on Keycloak");
    }

    // Remove all roles and rights from the server, which are not needed anymore
    remoteRolesAndRights.removeIf(role -> localRolesAndRights.contains(role.getName()));
    remoteRolesAndRights.removeIf(role -> role.getName().startsWith("default-roles-"));
    remoteRolesAndRights.removeIf(role -> role.getName().equals("offline_access"));
    remoteRolesAndRights.removeIf(role -> role.getName().equals("uma_authorization"));

    for (RoleRepresentation role : remoteRolesAndRights) {
      keycloak.roles().deleteRole(role.getName());
      log.info(role.getName() + " has been removed from Keycloak");
    }

    // Reload the roles from keycloak
    var syncedRoles = keycloak.roles().list(false);
    var syncedRolesMap = syncedRoles.stream()
      .collect(Collectors.toMap(RoleRepresentation::getName, Function.identity()));

    // Check if every role contains all rights
    for (Role localRole : localRoles) {
      var remoteRole = syncedRolesMap.get(localRole.getName());

      // If role does not exist, a clashing request has been made
      if (remoteRole == null) {
        log.error("Role " + localRole.getName() + " does not exist on Keycloak");
        continue;
      }

      // Check if all rights are assigned to the role
      var remoteRightsMap = keycloak.roles().get(localRole.getName()).getRoleComposites()
        .stream()
        .collect(Collectors.toMap(RoleRepresentation::getName, Function.identity()));
      var localRights = localRole.getRights();

      var rightsToAdd = localRights.stream()
        .map(Right::toString)
        .filter(string -> !remoteRightsMap.containsKey(string))
        .map(syncedRolesMap::get)
        .toList();
      var rightsToRemove = remoteRightsMap.keySet().stream()
        .filter(remoteRight -> !localRights.contains(Right.get(remoteRight)))
        .map(syncedRolesMap::get)
        .toList();

      // Add missing rights and remove obsolete rights
      keycloak.roles().get(localRole.getName()).deleteComposites(rightsToRemove);
      keycloak.roles().get(localRole.getName()).addComposites(rightsToAdd);
    }

    log.info("Roles and rights sync completed");
  }

  private void addRoleToUser(RoleAssignment assignment) {
    if (assignment.getValidFrom() != null && assignment.getValidFrom().isAfter(OffsetDateTime.now())) {
      return;
    }

    var role = keycloak.roles().get(assignment.getRole().getName()).toRepresentation();

    keycloak.users()
      .get(assignment.getUser().getKey().toString())
      .roles().realmLevel()
      .add(List.of(role));
  }
}
