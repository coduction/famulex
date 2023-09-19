package com.famulex.api.core.mapper;

import com.famulex.api.file.FileAccessService;
import com.famulex.api.file.FileHelper;
import com.famulex.api.file.api.FilePermissionResponse;
import com.famulex.api.file.model.FilePermission;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Class MappingHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.09.23
 */
@Service
@Mapper(componentModel = "spring")
public abstract class MappingHelper {

  @Autowired
  private FileAccessService fileAccessService;

  public String toFileUrl(FilePermission filePermission) {
    if (filePermission == null || filePermission.getFile() == null) {
      return null;
    }

    var fileAccess = fileAccessService.createFileAccess(filePermission);

    return FileHelper.formatUrl(fileAccess);
  }

  @AfterMapping
  public void generateFileAccess(@MappingTarget FilePermissionResponse response, FilePermission filePermission) {
    var fileAccess = fileAccessService.createFileAccess(filePermission);

    response.getFile().setUrl(FileHelper.formatUrl(fileAccess));
  }
}
