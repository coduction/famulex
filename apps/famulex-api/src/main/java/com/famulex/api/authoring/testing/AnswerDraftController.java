package com.famulex.api.authoring.testing;

import com.famulex.api.authoring.testing.api.TestDraftMapper;
import com.famulex.api.authoring.testing.api.request.AnswerDraftRequest;
import com.famulex.api.authoring.testing.api.response.AnswerDraftResponse;
import com.famulex.api.authoring.testing.repository.AnswerDraftRepository;
import com.famulex.api.authoring.testing.repository.QuestionDraftRepository;
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
public class AnswerDraftController {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final QuestionDraftRepository questionDraftRepository;
  private final AnswerDraftRepository answerDraftRepository;

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
  @GetMapping("/{testDraftKey}/answers")
  public List<AnswerDraftResponse> loadAnswers(@PathVariable UUID testDraftKey) {
    testDraftService.checkExistence(testDraftKey);

    return answerDraftRepository.findByQuestionDraftSectionDraftTestDraftKey(testDraftKey)
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  @GetMapping("/answers/{answerDraftKey}")
  public AnswerDraftResponse loadAnswer(@PathVariable UUID answerDraftKey) {
    var answerDraft = testDraftService.loadAnswerDraft(answerDraftKey);

    return testDraftMapper.toResponse(answerDraft);
  }

  /**************************************************************************
   * POST - Endpoints
   *************************************************************************/
  @PostMapping("/questions/{questionDraftKey}/answers")
  @ResponseStatus(HttpStatus.CREATED)
  public AnswerDraftResponse createAnswerDraft(@PathVariable UUID questionDraftKey,
                                               @Valid @RequestBody AnswerDraftRequest answerDraftRequest) {
    var questionDraft = testDraftService.loadQuestionDraft(questionDraftKey);
    var testDraftKey = questionDraft.getSectionDraft().getTestDraft().getKey();

    var answerDraft = testDraftMapper.fromRequest(answerDraftRequest, questionDraft);

    var existingAnswers = answerDraftRepository.findByQuestionDraftKeyOrderByPosition(questionDraftKey);
    PositioningHelper.shiftIndexOnInsertion(existingAnswers, answerDraft);
    answerDraftRepository.saveAll(existingAnswers);

    answerDraft = answerDraftRepository.save(answerDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);

    return testDraftMapper.toResponse(answerDraft);
  }

  /**************************************************************************
   * PUT - Endpoints
   *************************************************************************/
  @PutMapping("/answers/{answerDraftKey}")
  public AnswerDraftResponse updateAnswerDraft(@PathVariable UUID answerDraftKey,
                                               @Valid @RequestBody AnswerDraftRequest answerDraftRequest) {
    var answerDraft = testDraftService.loadAnswerDraft(answerDraftKey);
    var testDraftKey = answerDraft.getQuestionDraft().getSectionDraft().getTestDraft().getKey();

    testDraftMapper.updateFromRequest(answerDraftRequest, answerDraft);
    answerDraft = answerDraftRepository.save(answerDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);

    return testDraftMapper.toResponse(answerDraft);
  }

  @Transactional
  @PutMapping("/answers/{answerDraftKey}/position")
  public List<AnswerDraftResponse> moveAnswerDraft(@PathVariable UUID answerDraftKey,
                                                   @RequestParam Integer position) {
    var answerDraft = testDraftService.loadAnswerDraft(answerDraftKey);
    var existingAnswers = answerDraftRepository.findByQuestionDraftOrderByPosition(answerDraft.getQuestionDraft());
    var testDraftKey = answerDraft.getQuestionDraft().getSectionDraft().getTestDraft().getKey();

    PositioningHelper.shiftIndex(existingAnswers, answerDraft.getPosition(), position);
    existingAnswers = answerDraftRepository.saveAll(existingAnswers);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);

    return existingAnswers
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  /**************************************************************************
   * DELETE - Endpoints
   *************************************************************************/
  @Transactional
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/answers/{answerDraftKey}")
  public void deleteAnswerDraft(@PathVariable UUID answerDraftKey) {
    var answerDraft = testDraftService.loadAnswerDraft(answerDraftKey);
    var testDraftKey = answerDraft.getQuestionDraft().getSectionDraft().getTestDraft().getKey();

    var existingAnswers = answerDraftRepository.findByQuestionDraftOrderByPosition(answerDraft.getQuestionDraft());
    PositioningHelper.shiftIndexOnDeletion(existingAnswers, answerDraft);
    answerDraftRepository.saveAll(existingAnswers);

    answerDraftRepository.delete(answerDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);
  }
}
