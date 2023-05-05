package com.famulex.api.user.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.user.model.User;
import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Interface UserMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 05.12.22
 */
@Mapper(config = MapperConfiguration.class)
public interface UserMapper {

  UserResponse toUserResponse(User user);

  User toUser(UserResponse userResponse);

  User toUser(UserRepresentation userRepresentation);

  @Mapping(target = "password", ignore = true)
  void updateFromRequest(@MappingTarget User user, UserRequest userRequest);

  void updateFromRequest(@MappingTarget User user, UserRepresentation userRepresentation);

  void updateFromRequest(@MappingTarget UserRepresentation userRepresentation, UserRequest userRequest);
}
