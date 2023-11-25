import { HttpErrorResponse }                    from "@angular/common/http";
import { ActivatedRoute }                       from "@angular/router";
import { DynamicDialogRef }                     from "primeng/dynamicdialog";
import { QuestionDraft, QuestionDraftRequest }  from "@famulex/shared/famulex-api-client";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { QuestionDraftAction }                  from "./quesiton-draft.models";


export const QuestionDraftActions = createActionGroup({
  source: "Authoring - Test Draft Nodes",
  events: {
    "Load": emptyProps,
    "Load Success": props<{ response: QuestionDraft[] }>(),
    "Load Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Select Question": props<{ key: string, route?: ActivatedRoute }>(),
    "Deselect Question": emptyProps,

    "Create": props<{ request: QuestionDraftRequest, dialog?: DynamicDialogRef }>(),
    "Create Success": props<{ response: QuestionDraft, dialog?: DynamicDialogRef }>(),
    "Create Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Update": props<{ key: string, request: QuestionDraftRequest, dialog?: DynamicDialogRef }>(),
    "Update Success": props<{ update: Update<QuestionDraft>, dialog?: DynamicDialogRef }>(),
    "Update Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Delete": props<{ node: QuestionDraft }>(),
    "Delete Success": props<{ node: QuestionDraft }>(),
    "Delete Failure": props<{ node: QuestionDraft, httpError?: HttpErrorResponse }>(),

    "Add Action": props<{ id: string, action: QuestionDraftAction }>(),
    "Remove Action": props<{ id: string }>(),
    "Clear Actions": emptyProps
  }
});
