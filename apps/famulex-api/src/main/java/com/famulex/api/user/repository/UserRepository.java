package com.famulex.api.user.repository;

import com.famulex.api.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Interface UserRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByKey(UUID key);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);
}
