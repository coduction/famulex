package com.famulex.api.testing.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.testing.api.response.TestResponse;
import com.famulex.api.testing.model.Test;
import org.mapstruct.Mapper;

@Mapper(config = MapperConfiguration.class)
public interface TestMapper {

  TestResponse toResponse(Test test);

}
