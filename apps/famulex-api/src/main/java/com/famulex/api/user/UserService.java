package com.famulex.api.user;

import com.famulex.api.core.exception.BadRequestException;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.core.model.UserType;
import com.famulex.api.core.util.SecurityHelper;
import com.famulex.api.user.api.UserMapper;
import com.famulex.api.user.api.UserRequest;
import com.famulex.api.user.model.User;
import com.famulex.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.hibernate.internal.util.StringHelper;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Class UserService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Log4j2
@RequiredArgsConstructor
@Service
public class UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;

  private final RealmResource keycloak;

  public void syncUsers() {
    // Load all local users
    List<User> localUsers = userRepository.findAll();
    Map<String, User> localUsersMap = localUsers.stream()
      .collect(Collectors.toMap(user -> user.getKey().toString(), Function.identity()));

    // Load all users from identity provider
    List<User> remoteUsers = new ArrayList<>();
    for (UserRepresentation userRepresentation : keycloak.users().list()) {
      User remoteUser = new User();
      remoteUser.setUserRepresentation(userRepresentation);
      remoteUser.setKey(UUID.fromString(userRepresentation.getId()));
      remoteUsers.add(remoteUser);
    }

    Map<String, User> remoteUsersMap = remoteUsers.stream()
      .collect(Collectors.toMap(user -> user.getUserRepresentation().getId(), Function.identity()));

    int createdUsers = 0;
    int updatedUsers = 0;
    int deletedUsers = 0;
    int unchangedUsers = 0;

    // Point of truth: Remote users
    // First step: Delete local users that are not present in remote users
    for (User localUser : localUsers) {
      if (!remoteUsersMap.containsKey(localUser.getKey().toString())) {
        deleteUser(localUser.getKey());
        deletedUsers++;
      }
    }

    // Second step: Create or update local users
    for (User remoteUser : remoteUsers) {
      if (localUsersMap.containsKey(remoteUser.getKey().toString())) {
        // Update local user
        User localUser = localUsersMap.get(remoteUser.getKey().toString());
        User updatedLocalUser = updateUser(localUser.getKey(), remoteUser.getUserRepresentation());

        if (updatedLocalUser.getUpdatedAt().isAfter(localUser.getUpdatedAt())) {
          updatedUsers++;
        } else {
          unchangedUsers++;
        }
      } else {
        // Create local user
        createUser(remoteUser.getUserRepresentation());
        createdUsers++;
      }
    }

    log.info("Users synced. Created: {}, Updated: {}, Deleted: {}, Unchanged: {}", createdUsers, updatedUsers, deletedUsers, unchangedUsers);
  }

  @Transactional
  protected void createUser(UserRepresentation userRepresentation) {
    User localUser = userMapper.toUser(userRepresentation);
    localUser.setKey(UUID.fromString(userRepresentation.getId()));
    localUser.setType(UserType.SYNCED);

    userRepository.save(localUser);
  }

  @Transactional
  public User createUser(UserRequest userRequest) {
    if (userRepository.existsByEmail(userRequest.getEmail()) || userRepository.existsByUsername(userRequest.getUsername())) {
      throw new IllegalArgumentException("User already exists");
    }

    UserRepresentation userRepresentation = new UserRepresentation();
    userRepresentation.setUsername(userRequest.getUsername());
    userRepresentation.setEmail(userRequest.getEmail());
    userRepresentation.setFirstName(userRequest.getFirstName());
    userRepresentation.setLastName(userRequest.getLastName());
    userRepresentation.setEnabled(true);

    if (!StringHelper.isBlank(userRequest.getPassword())) {
      CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
      credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
      credentialRepresentation.setValue(userRequest.getPassword());
      credentialRepresentation.setTemporary(Boolean.TRUE.equals(userRequest.getPasswordTemporary()));

      userRepresentation.setCredentials(List.of(credentialRepresentation));
    }

    try {
      Response response = keycloak.users().create(userRepresentation);
      String createdUserKey = CreatedResponseUtil.getCreatedId(response);

      User user = userMapper.toUser(userRepresentation);
      user.setKey(UUID.fromString(createdUserKey));
      user.setType(UserType.SYNCED);

      user = userRepository.save(user);

      return user;
    } catch (Exception e) {
      log.error("Error while creating user", e);
      throw new BadRequestException("Error while creating user");
    }
  }

  @Transactional
  public User updateUser(UUID userKey, UserRequest userRequest) {
    User user = userRepository.findByKey(userKey)
      .orElseThrow(() -> new EntityNotFoundException("User not found", userKey));

    // Update local user
    userMapper.updateFromRequest(user, userRequest);
    userRepository.save(user);

    // Load remote user
    UserRepresentation userRepresentation = keycloak.users().get(userKey.toString()).toRepresentation();
    userMapper.updateFromRequest(userRepresentation, userRequest);

    // Set password if provided
    if (!StringHelper.isBlank(userRequest.getPassword())) {
      CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
      credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
      credentialRepresentation.setValue(userRequest.getPassword());
      credentialRepresentation.setTemporary(Boolean.TRUE.equals(userRequest.getPasswordTemporary()));

      userRepresentation.setCredentials(List.of(credentialRepresentation));
    }

    keycloak.users().get(userKey.toString()).update(userRepresentation);

    return user;
  }

  @Transactional
  public User updateUser(UUID userKey, UserRepresentation userRepresentation) {
    User user = userRepository.findByKey(userKey)
      .orElseThrow(() -> new EntityNotFoundException("User not found", userKey));

    // Update local user
    userMapper.updateFromRequest(user, userRepresentation);
    user = userRepository.saveAndFlush(user);

    return user;
  }

  @Transactional
  public void deleteUser(UUID userKey) {
    // TODO Handle deletion of user: Courses, files, tests, etc.

    // Delete local user
    User user = userRepository.findByKey(userKey)
      .orElseThrow(() -> new EntityNotFoundException("User not found", userKey));

    userRepository.delete(user);

    // Delete remote user
    keycloak.users().delete(userKey.toString());
  }

  public void updateLatestActivity(UUID userKey) {
    if (userKey == null) {
      throw new BadRequestException("No user found in security context");
    }

    // Load user from database
    User user = userRepository.findByKey(userKey)
      .orElseThrow(() -> new EntityNotFoundException("User not found", userKey));

    // Update last active date
    user.setLastActiveAt(OffsetDateTime.now());

    // Save user
    userRepository.save(user);
  }

  public User loadUserFromContext() {
    UUID userKey = SecurityHelper.getCurrentUserKey();

    if (userKey == null) {
      throw new EntityNotFoundException("User not found", "No user in context");
    }

    return userRepository.findByKey(SecurityHelper.getCurrentUserKey())
      .orElseThrow(() -> new EntityNotFoundException("User not found", SecurityHelper.getCurrentUserKey()));
  }
}
