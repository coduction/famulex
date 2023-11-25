import { HttpErrorResponse }                          from "@angular/common/http";
import { PageTestDraft, TestDraft, TestDraftRequest } from "@famulex/shared/famulex-api-client";
import { LoadDataEvent }                              from "@famulex/web/shared/table";
import { Update }                                     from "@ngrx/entity";
import { createActionGroup, emptyProps, props }       from "@ngrx/store";
import { TestDraftTab }                               from "./test-draft.models";

export const TestDraftActions = createActionGroup({
  source: "Authoring - Test Draft",
  events: {
    "Leave Editor": emptyProps(),

    "Set Tab": props<{ key: TestDraftTab }>(),        // Set the tab without loading data
    "Activate Tab": props<{ key: TestDraftTab }>(),   // Set the tab and load data

    "Load": props<{ event?: LoadDataEvent }>(),
    "Load Success": props<{ response: PageTestDraft }>(),
    "Load Failure": props<{ httpError: HttpErrorResponse }>(),

    "Create": props<{ request: TestDraftRequest }>(),
    "Create Success": props<{ response: TestDraft }>(),
    "Create Failure": props<{ error: HttpErrorResponse }>(),

    "Update": props<{ key: string, request: TestDraftRequest }>(),
    "Update Success": props<{ update: Update<TestDraft> }>(),
    "Update Failure": props<{ error: HttpErrorResponse }>(),

    "Delete": props<{ entry: TestDraft }>(),
    "Delete Success": props<{ entry: TestDraft }>(),
    "Delete Failure": props<{ error: HttpErrorResponse }>(),

    "Delete Many": props<{ keys: string[] }>(),
    "Delete Many Feedback": props<{ deletedKeys?: string[], errorKeys?: string[] }>(),

    "Select": props<{ key: string }>(),
    "Select Success": props<{ response: TestDraft }>(),
    "Select Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Publish": emptyProps(),
    "Publish Success": props<{ response: TestDraft }>(),
    "Publish Failure": props<{ response?: TestDraft, httpError?: HttpErrorResponse }>()
  }
});
