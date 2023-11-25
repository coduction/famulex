package com.famulex.api.authoring.testing.api;

import com.famulex.api.authoring.testing.api.request.AnswerDraftRequest;
import com.famulex.api.authoring.testing.api.request.QuestionDraftRequest;
import com.famulex.api.authoring.testing.api.request.SectionDraftRequest;
import com.famulex.api.authoring.testing.api.request.TestDraftRequest;
import com.famulex.api.authoring.testing.api.response.*;
import com.famulex.api.authoring.testing.model.AnswerDraft;
import com.famulex.api.authoring.testing.model.QuestionDraft;
import com.famulex.api.authoring.testing.model.SectionDraft;
import com.famulex.api.authoring.testing.model.TestDraft;
import com.famulex.api.core.mapper.MapperConfiguration;
import org.mapstruct.Context;
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
   * Section Draft
   *************************************************************************/
  SectionDraftResponse toResponse(SectionDraft sectionDraft);

  @Mapping(target = "testDraft", expression = "java(testDraft)")
  SectionDraft fromRequest(SectionDraftRequest sectionDraftRequest, @Context TestDraft testDraft);

  @Mapping(target = "parent", expression = "java(parentDraft)")
  @Mapping(target = "testDraft", expression = "java(testDraft)")
  SectionDraft fromRequest(SectionDraftRequest sectionDraftRequest, @Context TestDraft testDraft, @Context SectionDraft parentDraft);

  void updateFromRequest(SectionDraftRequest sectionDraftRequest, @MappingTarget SectionDraft sectionDraft);

  /**************************************************************************
   * Question Draft
   *************************************************************************/
  QuestionDraftResponse toResponse(QuestionDraft questionDraft);

  @Mapping(target = "sectionDraft", expression = "java(sectionDraft)")
  QuestionDraft fromRequest(QuestionDraftRequest questionDraftRequest, @Context SectionDraft sectionDraft);

  @Mapping(target = "position", ignore = true)
  void updateFromRequest(QuestionDraftRequest questionDraftRequest, @MappingTarget QuestionDraft questionDraft);

  /**************************************************************************
   * Answer Draft
   *************************************************************************/
  AnswerDraftResponse toResponse(AnswerDraft answerDraft);

  @Mapping(target = "questionDraft", expression = "java(questionDraft)")
  AnswerDraft fromRequest(AnswerDraftRequest answerDraftRequest, @Context QuestionDraft questionDraft);

  @Mapping(target = "position", ignore = true)
  void updateFromRequest(AnswerDraftRequest answerDraftRequest, @MappingTarget AnswerDraft answerDraft);
}
