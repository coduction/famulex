package com.famulex.api.authoring.testing;

import com.famulex.api.authoring.testing.api.TestDraftMapper;
import com.famulex.api.authoring.testing.api.request.QuestionDraftRequest;
import com.famulex.api.authoring.testing.api.response.QuestionDraftResponse;
import com.famulex.api.authoring.testing.model.QuestionDraft;
import com.famulex.api.authoring.testing.repository.QuestionDraftRepository;
import com.famulex.api.authoring.testing.repository.TestDraftRepository;
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
@RequestMapping("/authoring/testing/{testDraftKey}/questions")
@RequiredArgsConstructor
public class QuestionDraftController {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final TestDraftRepository testDraftRepository;
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
  @GetMapping
  public List<QuestionDraftResponse> loadQuestions(@PathVariable UUID testDraftKey) {
    testDraftService.checkExistence(testDraftKey);

    return questionDraftRepository.findByTestDraftKeyOrderByPosition(testDraftKey)
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  @Transactional
  @GetMapping("/{questionDraftKey}")
  public QuestionDraftResponse loadQuestion(@PathVariable UUID testDraftKey,
                                            @PathVariable UUID questionDraftKey) {
    var questionDraft = testDraftService.loadQuestionDraft(testDraftKey, questionDraftKey);

    return testDraftMapper.toResponse(questionDraft);
  }

  /**************************************************************************
   * POST - Endpoints
   *************************************************************************/
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public QuestionDraftResponse createQuestionDraft(@PathVariable UUID testDraftKey,
                                                   @Valid @RequestBody QuestionDraftRequest questionDraftRequest) {
    var testDraft = testDraftService.loadTestDraft(testDraftKey);

    QuestionDraft questionDraft = testDraftMapper.fromRequest(questionDraftRequest);
    questionDraft.setTestDraft(testDraft);

    // Shift position of all other questions
    List<QuestionDraft> existingQuestions = questionDraftRepository.findByTestDraftKeyOrderByPosition(testDraftKey);
    PositioningHelper.shiftIndexOnInsertion(existingQuestions, questionDraft);
    questionDraftRepository.saveAll(existingQuestions);

    questionDraft = questionDraftRepository.save(questionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraft, true, true);

    return testDraftMapper.toResponse(questionDraft);
  }

  /**************************************************************************
   * PUT - Endpoints
   *************************************************************************/
  @PutMapping("/{questionDraftKey}")
  public QuestionDraftResponse updateQuestionDraft(@PathVariable UUID testDraftKey,
                                                   @PathVariable UUID questionDraftKey,
                                                   @Valid @RequestBody QuestionDraftRequest questionDraftRequest) {
    var questionDraft = testDraftService.loadQuestionDraft(testDraftKey, questionDraftKey);

    testDraftMapper.updateFromRequest(questionDraftRequest, questionDraft);
    questionDraft = questionDraftRepository.save(questionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);

    return testDraftMapper.toResponse(questionDraft);
  }

  @Transactional
  @PutMapping("/{questionDraftKey}/position")
  public List<QuestionDraftResponse> moveQuestionDraft(@PathVariable UUID testDraftKey,
                                                       @PathVariable UUID questionDraftKey,
                                                       @RequestParam Integer newPosition) {
    QuestionDraft questionDraft = testDraftService.loadQuestionDraft(testDraftKey, questionDraftKey);
    List<QuestionDraft> existingQuestions = questionDraftRepository.findByTestDraftKeyOrderByPosition(testDraftKey);

    PositioningHelper.shiftIndex(existingQuestions, questionDraft.getPosition(), newPosition);
    questionDraftRepository.saveAll(existingQuestions);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);

    return existingQuestions
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  /**************************************************************************
   * DELETE - Endpoints
   *************************************************************************/
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{questionDraftKey}")
  public void deleteQuestionDraft(@PathVariable UUID testDraftKey,
                                  @PathVariable UUID questionDraftKey) {
    QuestionDraft questionDraft = testDraftService.loadQuestionDraft(testDraftKey, questionDraftKey);

    // Shift position of all other questions
    List<QuestionDraft> existingQuestions = questionDraftRepository.findByTestDraftKeyOrderByPosition(testDraftKey);
    PositioningHelper.shiftIndexOnDeletion(existingQuestions, questionDraft);
    questionDraftRepository.saveAll(existingQuestions);

    // Delete the question
    questionDraftRepository.delete(questionDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);
  }
}
