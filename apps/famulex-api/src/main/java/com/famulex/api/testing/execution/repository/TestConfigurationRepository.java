package com.famulex.api.testing.execution.repository;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.testing.execution.model.TestConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface AnswerDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Repository
public interface TestConfigurationRepository extends JpaRepository<TestConfiguration, Long> {

  boolean existsByTestKeyAndCourseDraftItemKey(UUID key, UUID courseDraftItemKey);

  Optional<TestConfiguration> findByKey(UUID key);

  List<TestConfiguration> findAllByCourseDraft(CourseDraft courseDraft);

  List<TestConfiguration> findAllByCourseDraftItem(CourseDraftItem item);
}
