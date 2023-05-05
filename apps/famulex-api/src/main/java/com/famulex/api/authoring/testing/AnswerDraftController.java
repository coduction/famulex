package com.famulex.api.authoring.testing;

import com.famulex.api.authoring.testing.api.TestDraftMapper;
import com.famulex.api.authoring.testing.api.request.AnswerDraftRequest;
import com.famulex.api.authoring.testing.api.response.AnswerDraftResponse;
import com.famulex.api.authoring.testing.model.AnswerDraft;
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
@RequestMapping("/authoring/testing/{testDraftKey}/questions/{questionDraftKey}/answers")
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
  @GetMapping
  public List<AnswerDraftResponse> loadAnswers(@PathVariable UUID testDraftKey,
                                               @PathVariable UUID questionDraftKey) {
    testDraftService.checkExistence(testDraftKey, questionDraftKey);

    return answerDraftRepository.findByQuestionDraftKeyOrderByPosition(questionDraftKey)
      .stream()
      .map(testDraftMapper::toResponse)
      .toList();
  }

  @GetMapping("/{answerDraftKey}")
  public AnswerDraftResponse loadAnswer(@PathVariable UUID testDraftKey,
                                        @PathVariable UUID questionDraftKey,
                                        @PathVariable UUID answerDraftKey) {
    AnswerDraft answerDraft = testDraftService.loadAnswerDraft(testDraftKey, questionDraftKey, answerDraftKey);

    return testDraftMapper.toResponse(answerDraft);
  }

  /**************************************************************************
   * POST - Endpoints
   *************************************************************************/
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AnswerDraftResponse createAnswerDraft(@PathVariable UUID testDraftKey,
                                               @PathVariable UUID questionDraftKey,
                                               @Valid @RequestBody AnswerDraftRequest answerDraftRequest) {
    var questionDraft = testDraftService.loadQuestionDraft(testDraftKey, questionDraftKey);

    AnswerDraft answerDraft = testDraftMapper.fromRequest(answerDraftRequest);
    answerDraft.setQuestionDraft(questionDraft);

    List<AnswerDraft> existingAnswers = answerDraftRepository.findByQuestionDraftKeyOrderByPosition(questionDraftKey);
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
  @PutMapping("/{answerDraftKey}")
  public AnswerDraftResponse updateAnswerDraft(@PathVariable UUID testDraftKey,
                                               @PathVariable UUID questionDraftKey,
                                               @PathVariable UUID answerDraftKey,
                                               @Valid @RequestBody AnswerDraftRequest answerDraftRequest) {
    var answerDraft = testDraftService.loadAnswerDraft(testDraftKey, questionDraftKey, answerDraftKey);

    testDraftMapper.updateFromRequest(answerDraftRequest, answerDraft);
    answerDraft = answerDraftRepository.save(answerDraft);

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);

    return testDraftMapper.toResponse(answerDraft);
  }

  @Transactional
  @PutMapping("/{answerDraftKey}/position")
  public List<AnswerDraftResponse> moveAnswerDraft(@PathVariable UUID testDraftKey,
                                                   @PathVariable UUID questionDraftKey,
                                                   @PathVariable UUID answerDraftKey,
                                                   @RequestParam Integer position) {
    var answerDraft = testDraftService.loadAnswerDraft(testDraftKey, questionDraftKey, answerDraftKey);
    List<AnswerDraft> existingAnswers = answerDraftRepository.findByQuestionDraftKeyOrderByPosition(questionDraftKey);

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
  @DeleteMapping("/{answerDraftKey}")
  public void deleteAnswerDraft(@PathVariable UUID testDraftKey,
                                @PathVariable UUID questionDraftKey,
                                @PathVariable UUID answerDraftKey) {
    var answerDraft = testDraftService.loadAnswerDraft(testDraftKey, questionDraftKey, answerDraftKey);

    List<AnswerDraft> existingAnswers = answerDraftRepository.findByQuestionDraftKeyOrderByPosition(questionDraftKey);
    PositioningHelper.shiftIndexOnDeletion(existingAnswers, answerDraft);
    answerDraftRepository.saveAll(existingAnswers);

    answerDraftRepository.delete(answerDraft);
    answerDraftRepository.flush();

    // Check the status of the test draft
    testDraftService.checkStatus(testDraftKey);
  }
}
