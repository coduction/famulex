package com.famulex.api.security.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.core.util.TextHelper;
import com.famulex.api.group.api.GroupMapper;
import com.famulex.api.jooq.tables.records.FxGroupRecord;
import com.famulex.api.jooq.tables.records.FxRoleAssignmentRecord;
import com.famulex.api.jooq.tables.records.FxRoleRecord;
import com.famulex.api.jooq.tables.records.FxUserRecord;
import com.famulex.api.security.api.request.RoleAssignmentRequestCreate;
import com.famulex.api.security.api.request.RoleAssignmentRequestUpdate;
import com.famulex.api.security.api.request.RoleRequest;
import com.famulex.api.security.api.response.RoleAssignmentResponse;
import com.famulex.api.security.api.response.RoleResponse;
import com.famulex.api.security.model.Right;
import com.famulex.api.security.model.Role;
import com.famulex.api.security.model.RoleAssignment;
import com.famulex.api.user.api.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Class RoleMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 20.05.23
 */
@Mapper(config = MapperConfiguration.class, uses = {UserMapper.class, GroupMapper.class})
public interface RoleMapper {

  /*************************************************************************
   * Role
   ************************************************************************/
  RoleResponse toRoleResponse(Role role);

  RoleResponse toRoleResponse(FxRoleRecord roleRecord);

  Role toRole(RoleRequest roleRequest);

  void updateRole(RoleRequest request, @MappingTarget Role role);

  /*************************************************************************
   * Role Assignment
   ************************************************************************/
  RoleAssignmentResponse toRoleAssignmentResponse(RoleAssignment assignment);


  @Mapping(target = "key", source = "assignment.key")
  @Mapping(target = "createdAt", source = "assignment.createdAt")
  @Mapping(target = "updatedAt", source = "assignment.updatedAt")
  @Mapping(target = "deletedAt", source = "assignment.deletedAt")
  @Mapping(target = "type", source = "assignment.type")
  RoleAssignmentResponse toRoleAssignmentResponse(FxRoleAssignmentRecord assignment, FxRoleRecord role, FxUserRecord user, FxGroupRecord group);

  RoleAssignment toRoleAssignment(RoleAssignmentRequestCreate request);

  void updateRoleAssignment(RoleAssignmentRequestUpdate request, @MappingTarget RoleAssignment assignment);

  /*************************************************************************
   * Rights
   ************************************************************************/
  default List<Right> toRights(String rightsString) {
    // Remove all whitespaces
    rightsString = TextHelper.removeAllBlanks(rightsString);

    return Arrays.stream(rightsString.split(",")) // Split by comma
      .filter(s -> !s.isEmpty())
      .map(Right::valueOf)
      .collect(Collectors.toList());
  }

}
