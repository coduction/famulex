package com.famulex.api.authoring.testing.model;

/**
 * Class TestPublicationFeedbackType
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 18.12.22
 */
public enum TestPublicationFeedbackType {
    // Feedback for test
    EMPTY_TEST,
    QUESTION_FEEDBACK,
    NO_POINTS_OR_PERCENTAGE,

    // Feedback for questions
    NO_ANSWERS,
    NOT_ENOUGH_ANSWERS,
    NO_CORRECT_ANSWER,
    NOT_ENOUGH_CORRECT_ANSWERS,
    TOO_MANY_CORRECT_ANSWERS,
    ONLY_SOME_ANSWERS_POINTS,
    NOT_ENOUGH_ANSWERS_POINTS,
    NOT_ENOUGH_SHOWN_ANSWERS,
    TOO_MANY_SHOWN_ANSWERS,
    LIMIT_ANSWERS_AND_NO_SHUFFLE,
    ANSWER_FEEDBACK,

    // Feedback for answers
    SAME_CONTENT,
    NO_POINTS,
    NO_POSITIVE_POINTS,
    NO_NEGATIVE_POINTS,
    NEGATIVE_CORRECT_POINTS,
    POSITIVE_WRONG_POINTS,
}
