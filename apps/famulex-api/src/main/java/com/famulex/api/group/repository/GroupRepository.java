package com.famulex.api.group.repository;

import com.famulex.api.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface GroupRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Repository
public interface GroupRepository extends JpaRepository<Group, Long>, GroupRepositoryCustom {

  Optional<Group> findByKey(UUID key);

  List<Group> findByKeyIn(List<UUID> keys);


}
