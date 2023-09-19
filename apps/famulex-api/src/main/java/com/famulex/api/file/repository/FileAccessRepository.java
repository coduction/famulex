package com.famulex.api.file.repository;

import com.famulex.api.file.model.FileAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Class FileAccessRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.09.23
 */
@Repository
public interface FileAccessRepository extends JpaRepository<FileAccess, Long> {

  Optional<FileAccess> findByKeyAndValidUntilAfter(UUID key, OffsetDateTime validUntil);

}
