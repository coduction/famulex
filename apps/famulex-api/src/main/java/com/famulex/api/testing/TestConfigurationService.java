package com.famulex.api.testing;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.course.model.Course;
import com.famulex.api.testing.api.TestConfigurationMapper;
import com.famulex.api.testing.execution.model.ConfigurationType;
import com.famulex.api.testing.execution.model.TestConfiguration;
import com.famulex.api.testing.execution.repository.TestConfigurationRepository;
import com.famulex.api.testing.model.Test;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Class TestConfigurationService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 01.04.23
 */
@Service
@RequiredArgsConstructor
public class TestConfigurationService {

  private final TestConfigurationRepository testConfigurationRepository;

  private final TestConfigurationMapper testConfigurationMapper;

  @Transactional
  public TestConfiguration createConfiguration(Test test, CourseDraftItem item) {
    // Create default configuration -  Copy from Test
    var testConfiguration = testConfigurationMapper.createDefaultConfiguration(test);
    testConfiguration.setType(ConfigurationType.COURSE_DRAFT);

    // Set courseDraft and item
    testConfiguration.setCourseDraft(item.getNode().getCourseDraft());
    testConfiguration.setCourseDraftItem(item);

    // Save
    return testConfigurationRepository.save(testConfiguration);
  }

  @Transactional
  public TestConfiguration createOrLoadConfiguration(Test test, CourseDraftItem item) {
    var testConfiguration = loadConfiguration(item);

    return testConfiguration.orElseGet(() -> createConfiguration(test, item));
  }

  public Optional<TestConfiguration> loadConfiguration(CourseDraftItem item) {
    List<TestConfiguration> configurations = testConfigurationRepository.findAllByCourseDraftItem(item);

    // If no configuration is found, return none
    if (configurations.isEmpty()) {
      return Optional.empty();
    }

    // This should never happen, but if it does, raise an error
    if (configurations.size() > 1) {
      throw new IllegalStateException("Multiple configurations found for item " + item.getKey());
    }

    // Return the active configuration
    return Optional.of(configurations.get(0));
  }

  @Transactional
  public boolean publishConfigurationsForCourse(CourseDraft draft, Course course) {


    return false;
  }
}
