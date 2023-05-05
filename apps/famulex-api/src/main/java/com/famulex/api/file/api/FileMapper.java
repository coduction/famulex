package com.famulex.api.file.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.file.FileHelper;
import com.famulex.api.file.model.File;
import com.famulex.api.file.model.FilePermission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Class FileMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Mapper(config = MapperConfiguration.class, imports = FileHelper.class)
public interface FileMapper {

  @Mapping(target = "url", expression = "java(FileHelper.formatUrl(file.getKey()))")
  FileResponse toResponse(File file);

  FilePermissionResponse toResponse(FilePermission filePermission);

}
