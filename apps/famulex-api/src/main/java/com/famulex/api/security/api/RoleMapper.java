package com.famulex.api.security.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.group.api.GroupMapper;
import com.famulex.api.security.api.request.RoleAssignmentRequestCreate;
import com.famulex.api.security.api.request.RoleAssignmentRequestUpdate;
import com.famulex.api.security.api.request.RoleRequest;
import com.famulex.api.security.api.response.RoleAssignmentResponse;
import com.famulex.api.security.api.response.RoleResponse;
import com.famulex.api.security.model.Role;
import com.famulex.api.security.model.RoleAssignment;
import com.famulex.api.user.api.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

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

  Role toRole(RoleRequest roleRequest);

  void updateRole(RoleRequest request, @MappingTarget Role role);

  /*************************************************************************
   * Role Assignment
   ************************************************************************/
  RoleAssignmentResponse toRoleAssignmentResponse(RoleAssignment assignment);

  RoleAssignment toRoleAssignment(RoleAssignmentRequestCreate request);

  void updateRoleAssignment(RoleAssignmentRequestUpdate request, @MappingTarget RoleAssignment assignment);

}
