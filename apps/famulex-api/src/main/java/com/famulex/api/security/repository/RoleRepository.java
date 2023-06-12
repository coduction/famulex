package com.famulex.api.security.repository;

import com.famulex.api.security.model.Role;
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
public interface RoleRepository extends JpaRepository<Role, Long>, RoleRepositoryCustom {

  Optional<Role> findByKey(UUID key);

  boolean existsByKey(UUID key);

  boolean existsByName(String name);
}
