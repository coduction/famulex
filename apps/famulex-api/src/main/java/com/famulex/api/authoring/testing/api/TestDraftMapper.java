package com.famulex.api.authoring.testing.api;

import com.famulex.api.authoring.testing.api.request.AnswerDraftRequest;
import com.famulex.api.authoring.testing.api.request.QuestionDraftRequest;
import com.famulex.api.authoring.testing.api.request.TestDraftRequest;
import com.famulex.api.authoring.testing.api.response.AnswerDraftResponse;
import com.famulex.api.authoring.testing.api.response.QuestionDraftResponse;
import com.famulex.api.authoring.testing.api.response.TestDraftResponse;
import com.famulex.api.authoring.testing.api.response.TestDraftStatusResponse;
import com.famulex.api.authoring.testing.model.AnswerDraft;
import com.famulex.api.authoring.testing.model.QuestionDraft;
import com.famulex.api.authoring.testing.model.TestDraft;
import com.famulex.api.core.mapper.MapperConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Interface TestDraftMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 17.12.22
 */
@Mapper(config = MapperConfiguration.class)
public interface TestDraftMapper {

  /**************************************************************************
   * Test Draft
   *************************************************************************/
  TestDraftResponse toResponse(TestDraft testDraft);

  TestDraftStatusResponse toStatusResponse(TestDraft testDraft);

  TestDraft fromRequest(TestDraftRequest testDraftRequest);

  void updateFromRequest(TestDraftRequest testDraftRequest, @MappingTarget TestDraft testDraft);

  /**************************************************************************
   * Question Draft
   *************************************************************************/
  QuestionDraftResponse toResponse(QuestionDraft questionDraft);

  QuestionDraft fromRequest(QuestionDraftRequest questionDraftRequest);

  @Mapping(target = "position", ignore = true)
  void updateFromRequest(QuestionDraftRequest questionDraftRequest, @MappingTarget QuestionDraft questionDraft);

  /**************************************************************************
   * Answer Draft
   *************************************************************************/
  AnswerDraftResponse toResponse(AnswerDraft answerDraft);

  AnswerDraft fromRequest(AnswerDraftRequest answerDraftRequest);

  @Mapping(target = "position", ignore = true)
  void updateFromRequest(AnswerDraftRequest answerDraftRequest, @MappingTarget AnswerDraft answerDraft);
}
