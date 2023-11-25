package com.famulex.api.authoring.testing;

import com.famulex.api.authoring.testing.api.TestDraftMapper;
import com.famulex.api.authoring.testing.api.request.QuestionDraftRequest;
import com.famulex.api.authoring.testing.api.response.QuestionDraftResponse;
import com.famulex.api.authoring.testing.repository.QuestionDraftRepository;
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
public class QuestionDraftController {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final SectionDraftRepository sectionDraftRepository;
  private final QuestionDraftRepository questionDraftRepository;

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
  @GetMapping("/{testDraftKey}/questions")
  public List<QuestionDraftResponse> loadQuestions(@PathVariable UUID testDraftKey) {
    testDraftService.checkExistence(testDraftKey);

    return questionDraftRepository.findBySectionDraftTestDraftKey(testDraftKey)
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  @Transactional
  @GetMapping("/questions/{questionDraftKey}")
  public QuestionDraftResponse loadQuestion(@PathVariable UUID questionDraftKey) {
    var questionDraft = testDraftService.loadQuestionDraft(questionDraftKey);

    return testDraftMapper.toResponse(questionDraft);
  }

  /**************************************************************************
   * POST - Endpoints
   *************************************************************************/
  @PostMapping("/sections/{sectionDraftKey}/questions")
  @ResponseStatus(HttpStatus.CREATED)
  public QuestionDraftResponse createQuestionDraft(@PathVariable UUID sectionDraftKey,
                                                   @Valid @RequestBody QuestionDraftRequest questionDraftRequest) {
    var sectionDraft = testDraftService.loadSectionDraft(sectionDraftKey);

    var questionDraft = testDraftMapper.fromRequest(questionDraftRequest, sectionDraft);

    // Shift position of all other questions
    var existingQuestions = questionDraftRepository.findBySectionDraftKeyOrderByPosition(sectionDraftKey);
    PositioningHelper.shiftIndexOnInsertion(existingQuestions, questionDraft);
    questionDraftRepository.saveAll(existingQuestions);

    questionDraft = questionDraftRepository.save(questionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(sectionDraft.getTestDraft(), true, true);

    return testDraftMapper.toResponse(questionDraft);
  }

  /**************************************************************************
   * PUT - Endpoints
   *************************************************************************/
  @PutMapping("/questions/{questionDraftKey}")
  public QuestionDraftResponse updateQuestionDraft(@PathVariable UUID questionDraftKey,
                                                   @Valid @RequestBody QuestionDraftRequest questionDraftRequest) {
    var questionDraft = testDraftService.loadQuestionDraft(questionDraftKey);

    testDraftMapper.updateFromRequest(questionDraftRequest, questionDraft);
    questionDraft = questionDraftRepository.save(questionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(questionDraft.getSectionDraft().getTestDraft(), true, true);

    return testDraftMapper.toResponse(questionDraft);
  }

  @Transactional
  @PutMapping("/questions/{questionDraftKey}/position")
  public List<QuestionDraftResponse> moveQuestionDraft(@PathVariable UUID questionDraftKey,
                                                       @RequestParam Integer newPosition) {
    var questionDraft = testDraftService.loadQuestionDraft(questionDraftKey);
    var existingQuestions = questionDraftRepository.findBySectionDraftOrderByPosition(questionDraft.getSectionDraft());

    PositioningHelper.shiftIndex(existingQuestions, questionDraft.getPosition(), newPosition);
    questionDraftRepository.saveAll(existingQuestions);

    // Check the status of the test draft
    testDraftService.checkStatus(questionDraft.getSectionDraft().getTestDraft(), true, true);

    return existingQuestions
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  /**************************************************************************
   * DELETE - Endpoints
   *************************************************************************/
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/questions/{questionDraftKey}")
  public void deleteQuestionDraft(@PathVariable UUID questionDraftKey) {
    var questionDraft = testDraftService.loadQuestionDraft(questionDraftKey);
    var testDraftKey = questionDraft.getSectionDraft().getTestDraft().getKey();

    // Shift position of all other questions
    var existingQuestions = questionDraftRepository.findBySectionDraftOrderByPosition(questionDraft.getSectionDraft());
    PositioningHelper.shiftIndexOnDeletion(existingQuestions, questionDraft);
    questionDraftRepository.saveAll(existingQuestions);

    // Delete the question
    questionDraftRepository.delete(questionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);
  }
}
