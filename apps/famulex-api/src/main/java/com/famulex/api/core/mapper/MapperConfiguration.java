package com.famulex.api.core.mapper;

import org.mapstruct.MapperConfig;

/**
 * Interface FamulexMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@MapperConfig(componentModel = "spring",
  uses = MappingHelper.class,
  unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface MapperConfiguration {
}
