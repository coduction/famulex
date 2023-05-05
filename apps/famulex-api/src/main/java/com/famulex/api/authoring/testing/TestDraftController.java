package com.famulex.api.authoring.testing;

import com.famulex.api.authoring.testing.api.TestDraftMapper;
import com.famulex.api.authoring.testing.api.request.TestDraftRequest;
import com.famulex.api.authoring.testing.api.response.TestDraftResponse;
import com.famulex.api.authoring.testing.api.response.TestDraftStatusResponse;
import com.famulex.api.authoring.testing.model.TestDraft;
import com.famulex.api.authoring.testing.model.TestStatus;
import com.famulex.api.authoring.testing.repository.TestDraftRepository;
import com.famulex.api.core.exception.EntityNotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.UUID;

/**
 * Class TestDraftController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Tag(name = "TestDraft")
@RestController
@RequestMapping("/authoring/testing")
@RequiredArgsConstructor
public class TestDraftController {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final TestDraftRepository testDraftRepository;

  /**************************************************************************
   * Services
   *************************************************************************/
  private final TestDraftService testDraftService;

  /**************************************************************************
   * Mappers
   *************************************************************************/
  private final TestDraftMapper testDraftMapper;

  /**************************************************************************
   * GET - Endpoints
   *************************************************************************/
  @GetMapping
  public Page<TestDraftResponse> loadTestDrafts(@ParameterObject Pageable pagination) {
    return testDraftRepository.findAll(pagination)
      .map(testDraftMapper::toResponse);
  }

  @Transactional
  @GetMapping("/{testDraftKey}")
  public TestDraftResponse loadTestDraft(@PathVariable UUID testDraftKey) {
    var testDraft = testDraftService.loadTestDraft(testDraftKey);
    testDraft.validate();

    return testDraftMapper.toResponse(testDraft);
  }

  @Transactional
  @GetMapping("/{testDraftKey}/status")
  public TestDraftStatusResponse loadTestDraftStatus(@PathVariable UUID testDraftKey) {
    var testDraft = testDraftRepository.findByKey(testDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(TestDraft.class, testDraftKey));

    return testDraftMapper.toStatusResponse(testDraft);
  }

  /**************************************************************************
   * POST - Endpoints
   *************************************************************************/
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TestDraftResponse createTestDraft(@Valid @RequestBody TestDraftRequest testDraftRequest) {
    TestDraft testDraft = testDraftMapper.fromRequest(testDraftRequest);
    testDraft.setStatus(TestStatus.DRAFT);

    // TODO Membership for editors

    testDraft = testDraftRepository.save(testDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraft, false, true);

    return testDraftMapper.toResponse(testDraft);
  }

  @Transactional
  @PostMapping("/{testDraftKey}/publish")
  public TestDraftResponse publishTestDraft(@PathVariable UUID testDraftKey, HttpServletResponse response) {
    TestDraft testDraft = testDraftRepository.findByKey(testDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(TestDraft.class, testDraftKey));

    // Take the previous publication date to check if the test draft has been updated
    var previousVersion = testDraft.getPublishedVersion();

    testDraft = testDraftService.publishTestDraft(testDraft);

    if (testDraft.getStatus() == TestStatus.INVALID) {
      response.setStatus(HttpStatus.UNPROCESSABLE_ENTITY.value());
    } else if (previousVersion == null) {
      response.setStatus(HttpStatus.CREATED.value());
    } else if (Objects.equals(previousVersion, testDraft.getPublishedVersion())) {
      response.setStatus(HttpStatus.NO_CONTENT.value());
    } else {
      response.setStatus(HttpStatus.ACCEPTED.value());
    }

    return testDraftMapper.toResponse(testDraft);
  }

  /**************************************************************************
   * PUT - Endpoints
   *************************************************************************/
  @Transactional
  @PutMapping("/{testDraftKey}")
  public TestDraftResponse updateTestDraft(@PathVariable UUID testDraftKey,
                                           @Valid @RequestBody TestDraftRequest testDraftRequest) {
    TestDraft testDraft = testDraftRepository.findByKey(testDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(TestDraft.class, testDraftKey));

    testDraftMapper.updateFromRequest(testDraftRequest, testDraft);

    testDraft = testDraftRepository.save(testDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraft, false, true);

    return testDraftMapper.toResponse(testDraft);
  }

  /**************************************************************************
   * DELETE - Endpoints
   *************************************************************************/
  @DeleteMapping("/{testDraftKey}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteTestDraft(@PathVariable UUID testDraftKey) {
    var testDraft = testDraftService.loadTestDraft(testDraftKey);

    testDraftRepository.delete(testDraft);
  }
}
