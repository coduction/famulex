package com.famulex.api.authoring.testing.util;

import com.famulex.api.authoring.testing.model.AnswerDraft;
import com.famulex.api.authoring.testing.model.QuestionDraft;
import com.famulex.api.authoring.testing.model.TestDraft;
import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.testing.model.Answer;
import com.famulex.api.testing.model.Question;
import com.famulex.api.testing.model.Test;
import org.mapstruct.*;

/**
 * Interface CoursePublicationMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 15.12.22
 */
@Mapper(config = MapperConfiguration.class)
public interface TestDraftPublicationMapper {

  @Mapping(target = "key", ignore = true)
  @Mapping(target = "testDraft", source = ".")
  Test toTest(TestDraft testDraft);

  @AfterMapping
  default void updateResult(@MappingTarget Test test) {
    test.getQuestions().forEach(question -> updateResult(question, test));
  }

  @Mapping(target = "key", ignore = true)
  @Mapping(target = "questionDraft", source = ".")
  Question toQuestion(QuestionDraft questionDraft);

  @AfterMapping
  default void updateResult(@MappingTarget Question question, @Context Test test) {
    // Set test for hibernate
    question.setTest(test);

    question.getAnswers().forEach(answer -> updateResult(answer, question));
  }

  @Mapping(target = "key", ignore = true)
  @Mapping(target = "answerDraft", source = ".")
  Answer toAnswer(AnswerDraft answerDraft);

  @AfterMapping
  default void updateResult(@MappingTarget Answer answer, @Context Question question) {
    // Set test for hibernate
    answer.setQuestion(question);
  }
}
