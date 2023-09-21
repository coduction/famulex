import { HttpErrorResponse }                    from "@angular/common/http";
import { CourseDraft, User, UserRequest }       from "@famulex/shared/famulex-api-client";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const CourseDraftEditorActions = createActionGroup({
  source: "Authoring - Course Draft Editor",
  events: {
    "Leave Editor": emptyProps(),

    "Load Course Draft": props<{ key: string }>(),
    "Load Course Draft Success": props<{ response: CourseDraft }>(),
    "Load Course Draft Failure": props<{ routingError: boolean, httpError?: HttpErrorResponse }>(),

    "Create": props<{ userRequest: UserRequest }>(),
    "Create Success": props<{ user: User }>(),
    "Create Failure": props<{ error: HttpErrorResponse }>(),
    "Update": props<{ key: string, userRequest: UserRequest }>(),
    "Update Success": props<{ user: Update<User> }>(),
    "Update Failure": props<{ error: HttpErrorResponse }>(),
    "Delete": props<{ user: User }>(),
    "Delete Success": props<{ user: User }>(),
    "Delete Failure": props<{ error?: HttpErrorResponse, isCurrentUser?: boolean }>(),
    "Delete Many": props<{ keys: string[] }>(),
    "Delete Many Feedback": props<{ deletedKeys?: string[], errorKeys?: string[], error?: HttpErrorResponse, containsCurrentUser?: boolean }>(),
    "Clear": emptyProps()
  }
});
