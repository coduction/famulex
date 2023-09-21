import { HttpErrorResponse }                                from "@angular/common/http";
import { CourseDraft, CourseDraftRequest, PageCourseDraft } from "@famulex/shared/famulex-api-client";
import { DialogOptions }                                    from "@famulex/shared/util";
import { LoadDataEvent }                                    from "@famulex/web/shared/table";
import { Update }                                           from "@ngrx/entity";
import { createActionGroup, emptyProps, props }             from "@ngrx/store";
import { CourseDraftTab }                                   from "./course-draft-list.models";


export const CourseDraftListActions = createActionGroup({
  source: "Authoring - Course Drafts",
  events: {
    "Set Tab": props<{ key: CourseDraftTab }>(),        // Set the tab without loading data
    "Activate Tab": props<{ key: CourseDraftTab }>(),   // Set the tab and load data
    "Load": props<{ event?: LoadDataEvent }>(),
    "Load Success": props<{ page: PageCourseDraft }>(),
    "Load Failure": props<{ error: HttpErrorResponse }>(),
    "Create": props<{ request: CourseDraftRequest, dialog?: DialogOptions }>(),
    "Create Success": props<{ response: CourseDraft, dialog?: DialogOptions }>(),
    "Create Failure": props<{ error: HttpErrorResponse, dialog?: DialogOptions }>(),
    "Update": props<{ key: string, request: CourseDraftRequest, dialog?: DialogOptions }>(),
    "Update Success": props<{ update: Update<CourseDraft>, dialog?: DialogOptions }>(),
    "Update Failure": props<{ error: HttpErrorResponse, dialog?: DialogOptions }>(),
    "Delete": props<{ entry: CourseDraft }>(),
    "Delete Success": props<{ entry: CourseDraft }>(),
    "Delete Failure": props<{ error?: HttpErrorResponse }>(),
    "Delete Many": props<{ keys: string[] }>(),
    "Delete Many Feedback": props<{ deletedKeys?: string[], errorKeys?: string[], error?: HttpErrorResponse }>(),
    "Clear": emptyProps()
  }
});
