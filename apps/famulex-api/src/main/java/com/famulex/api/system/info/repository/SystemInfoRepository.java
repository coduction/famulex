package com.famulex.api.system.info.repository;

import com.famulex.api.system.info.model.SystemInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Class SystemInfoRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.09.23
 */
@Repository
public interface SystemInfoRepository extends JpaRepository<SystemInfo, Long> {

  @Query("SELECT info " +
    "FROM SystemInfo info " +
    "ORDER BY info.id ASC " +
    "LIMIT 1")
  Optional<SystemInfo> findFirst();

}
