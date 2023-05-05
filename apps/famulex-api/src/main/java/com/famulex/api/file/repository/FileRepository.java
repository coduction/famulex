package com.famulex.api.file.repository;

import com.famulex.api.file.model.File;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Interface FileRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 06.03.22
 */
@Repository
public interface FileRepository extends JpaRepository<File, Long> {

  @Query("SELECT file FROM File file JOIN FETCH file.creator where file.key = :key")
  Optional<File> findByKey(@Param("key") UUID key);


  @EntityGraph(attributePaths = "courseDraftItemPermits", type = EntityGraph.EntityGraphType.LOAD)
    //@EntityGraph(attributePaths = "courseDraftItemPermits", type = EntityGraph.EntityGraphType.LOAD)
  Optional<File> findWithAllPermitsByKey(UUID key);


}
