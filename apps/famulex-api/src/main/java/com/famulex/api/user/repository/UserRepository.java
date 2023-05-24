package com.famulex.api.user.repository;

import com.famulex.api.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

  @Query("SELECT u FROM User u " +
    "WHERE lower(concat(u.key, ' ', u.username, ' ', u.firstName, ' ', u.lastName, ' ', u.email) ) " +
    "LIKE lower(concat('%', :keyword, '%'))")
  Page<User> search(@Param("keyword") String keyword, Pageable pagination);

  Optional<User> findByKey(UUID key);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);
}
