import { QuestionType } from "@famulex/shared/famulex-api-client";

export function translateQuestionType(type: QuestionType): string {
  switch (type) {
    case QuestionType.SingleChoice:
      return $localize`Single Choice`;
    case QuestionType.MultipleChoice:
      return $localize`Multiple Choice`;
  }

  return "";
}

export function iconForQuestionType(type: QuestionType): string {
  switch (type) {
    case QuestionType.SingleChoice:
      return "fa fa-fw fa-check-circle";
    case QuestionType.MultipleChoice:
      return "fa fa-fw fa-check-square";
  }

  return "";
}
