package com.famulex.api.testing;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.authoring.course.repository.CourseDraftItemRepository;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.core.exception.BadRequestException;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.testing.api.TestConfigurationMapper;
import com.famulex.api.testing.api.response.TestConfigurationResponse;
import com.famulex.api.testing.execution.model.TestConfiguration;
import com.famulex.api.testing.execution.repository.TestConfigurationRepository;
import com.famulex.api.testing.model.Test;
import com.famulex.api.testing.repository.TestRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Class TestConfigurationController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.01.22
 */
@RestController
@RequestMapping("/test-configurations")
@Tag(name = "TestConfiguration")
@RequiredArgsConstructor
public class TestConfigurationController {

  private final TestRepository testRepository;
  private final TestConfigurationRepository testConfigurationRepository;
  private final CourseDraftRepository courseDraftRepository;
  private final CourseDraftItemRepository courseDraftItemRepository;

  private final TestConfigurationService testConfigurationService;

  private final TestConfigurationMapper testConfigurationMapper;

  /**************************************************************************
   * GET - Endpoints
   *************************************************************************/
  @Transactional
  @GetMapping("/courseDraft/{draftKey}")
  public List<TestConfigurationResponse> loadTestConfigurationsForCourseDraft(@PathVariable UUID draftKey) {
    var courseDraft = courseDraftRepository.findByKey(draftKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseDraft.class, draftKey));

    var testConfigurations = testConfigurationRepository.findAllByCourseDraft(courseDraft);

    return testConfigurationMapper.toResponse(testConfigurations);
  }

  @Transactional
  @GetMapping("/courseDraftItem/{itemKey}")
  public Optional<TestConfigurationResponse> loadTestConfigurationForCourseDraftItem(@PathVariable UUID itemKey) {
    var courseDraftItem = courseDraftItemRepository.findByKey(itemKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseDraftItem.class, itemKey));

    var testConfiguration = testConfigurationService.loadConfiguration(courseDraftItem);

    return testConfiguration.map(testConfigurationMapper::toResponse);
  }

  @Transactional
  @GetMapping("/courseItem/{itemKey}/test/{testKey}")
  public TestConfigurationResponse loadOrCreateTestConfiguration(@PathVariable UUID itemKey, @PathVariable UUID testKey) {
    var courseDraftItem = courseDraftItemRepository.findByKey(itemKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseDraftItem.class, itemKey));

    var test = testRepository.findByKey(testKey)
      .orElseThrow(() -> new EntityNotFoundException(Test.class, testKey));

    var testConfiguration = testConfigurationService.createOrLoadConfiguration(test, courseDraftItem);

    return testConfigurationMapper.toResponse(testConfiguration);
  }

  /**************************************************************************
   * POST - Endpoints
   *************************************************************************/
  @Transactional
  @PostMapping("/courseItem/{itemKey}/test/{testKey}")
  public TestConfigurationResponse createTestConfiguration(@PathVariable UUID itemKey,
                                                           @PathVariable UUID testKey) {
    if (testConfigurationRepository.existsByTestKeyAndCourseDraftItemKey(testKey, itemKey)) {
      throw new BadRequestException("Test configuration for the given test and course node item already exists");
    }

    var courseDraftItem = courseDraftItemRepository.findByKey(itemKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseDraftItem.class, itemKey));

    var test = testRepository.findByKey(testKey)
      .orElseThrow(() -> new EntityNotFoundException(Test.class, testKey));

    var testConfiguration = testConfigurationService.createConfiguration(test, courseDraftItem);

    return testConfigurationMapper.toResponse(testConfiguration);
  }

  /**************************************************************************
   * PUT - Endpoints
   *************************************************************************/

  /**************************************************************************
   * DELETE - Endpoints
   *************************************************************************/
  @DeleteMapping("/{configurationKey}")
  public void deleteTestConfiguration(@PathVariable UUID configurationKey) {
    var testConfiguration = testConfigurationRepository.findByKey(configurationKey)
      .orElseThrow(() -> new EntityNotFoundException(TestConfiguration.class, configurationKey));

    testConfigurationRepository.delete(testConfiguration);
  }

}
