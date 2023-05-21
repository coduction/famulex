package com.famulex.api.security.repository;

import com.famulex.api.security.model.Role;
import com.famulex.api.security.model.RoleAssignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Class RoleRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 20.05.23
 */
@Repository
public interface RoleAssignmentRepository extends JpaRepository<RoleAssignment, Long> {

  Optional<RoleAssignment> findByKey(UUID key);

  Page<RoleAssignment> findByRole(Role role, Pageable pageable);
}
