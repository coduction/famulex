package com.famulex.api.file.repository;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.file.model.File;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.file.model.FilePermissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface FileAccessPublicRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.12.22
 */
@Repository
public interface FilePermissionRepository extends JpaRepository<FilePermission, Long> {

  Optional<FilePermission> findByKey(UUID key);

  List<FilePermission> findByFileAndType(File file, FilePermissionType type);

  boolean existsByFile(File file);

  int countByCourseDraft(CourseDraft courseDraft);

  int countByCourseDraftItem(CourseDraftItem courseDraftItem);

}
