import { HttpErrorResponse }                    from "@angular/common/http";
import { DynamicDialogRef }                     from "@coduction/primeng/dynamicdialog";
import { AnswerDraft, AnswerDraftRequest }      from "@famulex/shared/famulex-api-client";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const AnswerDraftActions = createActionGroup({
  source: "Authoring - Test Draft Items",
  events: {
    "Select": props<{ key: string }>(),

    "Load": emptyProps(),
    "Load Success": props<{ response: AnswerDraft[] }>(),
    "Load Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Create": props<{ request: AnswerDraftRequest, dialog?: DynamicDialogRef }>(),
    "Create Success": props<{ response: AnswerDraft, dialog?: DynamicDialogRef }>(),
    "Create Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Update": props<{ key: string, request: AnswerDraftRequest, dialog?: DynamicDialogRef }>(),
    "Update Success": props<{ update: Update<AnswerDraft>, dialog?: DynamicDialogRef }>(),
    "Update Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Delete": props<{ entry: AnswerDraft }>(),
    "Delete Success": props<{ entry: AnswerDraft }>(),
    "Delete Failure": props<{ entry: AnswerDraft, httpError?: HttpErrorResponse }>()
  }
});

