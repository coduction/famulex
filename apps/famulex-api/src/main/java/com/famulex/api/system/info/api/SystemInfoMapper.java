package com.famulex.api.system.info.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.core.mapper.MappingHelper;
import com.famulex.api.core.util.TextHelper;
import com.famulex.api.file.FileHelper;
import com.famulex.api.system.info.model.SystemInfo;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Class SystemInfoMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.09.23
 */
@Mapper(config = MapperConfiguration.class, uses = MappingHelper.class)
public interface SystemInfoMapper {

  @Mapping(target = "logoUrl", source = "logoPermission")
  @Mapping(target = "compactLogoUrl", source = "compactLogoPermission")
  SystemInfoResponse toResponse(SystemInfo systemInfo);

  @AfterMapping
  default void provideLogoUrls(@MappingTarget SystemInfoResponse response) {
    if (TextHelper.isNotBlank(response.getLogoUrl())) {
      response.setLogoUrl(FileHelper.serverUrl + "/system/info/logo");
    }

    if (TextHelper.isNotBlank(response.getCompactLogoUrl())) {
      response.setCompactLogoUrl(FileHelper.serverUrl + "/system/info/logo-compact");
    }
  }
}
