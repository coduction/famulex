package com.famulex.api.security.repository;

import com.famulex.api.core.model.MembershipType;
import com.famulex.api.security.api.response.RoleAssignmentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Class RoleAssignmentRepositoryCustom
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 12.06.23
 */
public interface RoleAssignmentRepositoryCustom {

  Page<RoleAssignmentResponse> searchAssignments(UUID roleKey, MembershipType type, String search, Pageable pageable);

}
