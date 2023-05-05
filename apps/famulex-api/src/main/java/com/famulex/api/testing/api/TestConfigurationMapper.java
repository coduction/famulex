package com.famulex.api.testing.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.core.mapper.SimpleMapping;
import com.famulex.api.testing.api.request.TestConfigurationRequest;
import com.famulex.api.testing.api.response.TestConfigurationResponse;
import com.famulex.api.testing.execution.model.TestConfiguration;
import com.famulex.api.testing.model.Test;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(config = MapperConfiguration.class, uses = {TestMapper.class})
public interface TestConfigurationMapper {

  @SimpleMapping
  @Mapping(target = "testKey", source = "test.key")
  @Mapping(target = "courseDraftKey", source = "courseDraft.key")
  @Mapping(target = "courseDraftItemKey", source = "courseDraftItem.key")
  @Mapping(target = "courseKey", source = "course.key")
  @Mapping(target = "courseItemKey", source = "courseItem.key")
  TestConfigurationResponse toResponse(TestConfiguration testConfiguration);

  @IterableMapping(qualifiedBy = SimpleMapping.class)
  List<TestConfigurationResponse> toResponse(List<TestConfiguration> testConfigurations);

  TestConfiguration fromRequest(TestConfigurationRequest configurationRequest);

  void updateFromRequest(TestConfigurationRequest configurationRequest, @MappingTarget TestConfiguration configuration);

  @Mapping(target = "key", ignore = true)
  @Mapping(target = "test", source = ".")
  TestConfiguration createDefaultConfiguration(Test test);
}
