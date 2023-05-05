package com.famulex.api.testing;

import com.famulex.api.testing.api.TestMapper;
import com.famulex.api.testing.api.response.TestResponse;
import com.famulex.api.testing.repository.TestRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Class TestController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@RestController
@RequestMapping("/tests")
@Tag(name = "Test")
@RequiredArgsConstructor
public class TestController {

  private final TestRepository testRepository;

  private final TestService testService;

  private final TestMapper testMapper;

  /**************************************************************************
   * GET - Endpoints
   *************************************************************************/
  @Transactional
  @GetMapping
  public Page<TestResponse> loadTests(@ParameterObject Pageable pagination) {
    var tests = testRepository.findAll(pagination);

    return tests.map(testMapper::toResponse);
  }

}
