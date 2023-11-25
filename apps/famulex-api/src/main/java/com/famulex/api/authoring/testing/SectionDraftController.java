package com.famulex.api.authoring.testing;

import com.famulex.api.authoring.testing.api.TestDraftMapper;
import com.famulex.api.authoring.testing.api.request.SectionDraftRequest;
import com.famulex.api.authoring.testing.api.response.SectionDraftResponse;
import com.famulex.api.authoring.testing.model.SectionDraft;
import com.famulex.api.authoring.testing.repository.SectionDraftRepository;
import com.famulex.api.core.util.PositioningHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
public class SectionDraftController {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final SectionDraftRepository sectionDraftRepository;

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
  @GetMapping("/{testDraftKey}/sections")
  public List<SectionDraftResponse> loadSectionDrafts(@PathVariable UUID testDraftKey) {
    return sectionDraftRepository.findByTestDraftKey(testDraftKey)
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  /**************************************************************************
   * POST - Endpoints
   *************************************************************************/
  @PostMapping("/{testDraftKey}/sections")
  @ResponseStatus(HttpStatus.CREATED)
  public SectionDraftResponse createSectionDraft(@PathVariable UUID testDraftKey,
                                                 @Valid @RequestBody SectionDraftRequest sectionDraftRequest) {
    var testDraft = testDraftService.loadTestDraft(testDraftKey);
    var parentDraft = testDraftService.loadSectionDraftParent(sectionDraftRequest.getParentKey());
    var sectionDraft = testDraftMapper.fromRequest(sectionDraftRequest, testDraft, parentDraft);

    // Shift position of all other sections
    List<SectionDraft> existingSections = sectionDraftRepository.findByTestDraftAndParentOrderByPosition(testDraft, parentDraft);
    PositioningHelper.shiftIndexOnInsertion(existingSections, sectionDraft);
    sectionDraftRepository.saveAll(existingSections);

    sectionDraft = sectionDraftRepository.save(sectionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraft, true, true);

    return testDraftMapper.toResponse(sectionDraft);
  }

  /**************************************************************************
   * PUT - Endpoints
   *************************************************************************/
  @PutMapping("/sections/{sectionDraftKey}")
  public SectionDraftResponse updateSectionDraft(@PathVariable UUID sectionDraftKey,
                                                 @Valid @RequestBody SectionDraftRequest sectionDraftRequest) {
    var sectionDraft = testDraftService.loadSectionDraft(sectionDraftKey);

    testDraftMapper.updateFromRequest(sectionDraftRequest, sectionDraft);
    sectionDraft = sectionDraftRepository.save(sectionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(sectionDraft.getTestDraft(), true, true);

    return testDraftMapper.toResponse(sectionDraft);
  }

  @Transactional
  @PutMapping("/sections/{sectionDraftKey}/position")
  public List<SectionDraftResponse> moveSectionDraft(@PathVariable UUID sectionDraftKey,
                                                     @RequestParam Integer newPosition) {
    var sectionDraft = testDraftService.loadSectionDraft(sectionDraftKey);
    List<SectionDraft> existingSections = sectionDraftRepository.findByTestDraftAndParentOrderByPosition(sectionDraft.getTestDraft(), sectionDraft.getParent());

    PositioningHelper.shiftIndex(existingSections, sectionDraft.getPosition(), newPosition);
    sectionDraftRepository.saveAll(existingSections);

    // Check the status of the test draft
    testDraftService.checkStatus(sectionDraft.getTestDraft(), true, true);

    return existingSections
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  /**************************************************************************
   * DELETE - Endpoints
   *************************************************************************/
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/sections/{sectionDraftKey}/")
  public void deleteQuestionDraft(@PathVariable UUID sectionDraftKey) {
    var sectionDraft = testDraftService.loadSectionDraft(sectionDraftKey);
    var testDraftKey = sectionDraft.getTestDraft().getKey();

    // Shift position of all other questions
    List<SectionDraft> existingSections = sectionDraftRepository.findByTestDraftAndParentOrderByPosition(sectionDraft.getTestDraft(), sectionDraft.getParent());
    PositioningHelper.shiftIndexOnDeletion(existingSections, sectionDraft);
    sectionDraftRepository.saveAll(existingSections);

    // Delete the question
    sectionDraftRepository.delete(sectionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);
  }
}
