package com.famulex.api.authoring.course.model;

/**
 * Enum PublicationFeedbackItemType
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 12.12.22
 */
public enum CoursePublicationFeedbackType {
    // Feedback for course
    EMPTY_COURSE,
    NODE_FEEDBACK,

    // Feedback for nodes
    EMPTY_CHAPTER,
    EMPTY_NODE,
    CHAPTER_WITH_ITEMS,

    // Feedback for nodes regarding children or items
    CHILD_FEEDBACK,
    ITEM_FEEDBACK,

    // Feedback for items
    NO_VIDEO,
    NO_PDF,
    NO_QUIZ,
    NO_TEXT
}
