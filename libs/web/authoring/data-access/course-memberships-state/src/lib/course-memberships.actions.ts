import { HttpErrorResponse }                                                                                    from "@angular/common/http";
import { CourseMembership, CourseMembershipRequestCreate, CourseMembershipRequestUpdate, PageCourseMembership } from "@famulex/shared/famulex-api-client";
import { LoadDataEvent }                                                                                        from "@famulex/web/shared/table";
import { Update }                                                                                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props }                                                                 from "@ngrx/store";


export const CourseMembershipsActions = createActionGroup({
  source: "Authoring - Course Memberships",
  events: {
    "Clear": emptyProps(),
    "Set Course": props<{ key: string }>(),

    "Load": props<{ event?: LoadDataEvent }>(),
    "Load Success": props<{ response: PageCourseMembership }>(),
    "Load Failure": props<{ routingError: boolean, httpError?: HttpErrorResponse }>(),

    "Create": props<{ request: CourseMembershipRequestCreate, callback?: () => void }>(),
    "Create Success": props<{ response: CourseMembership, callback?: () => void }>(),
    "Create Failure": props<{ httpError?: HttpErrorResponse, courseNotSet?: boolean }>(),

    "Create Many": props<{ requests: CourseMembershipRequestCreate[], callback?: () => void }>(),
    "Create Many Feedback": props<{ responses?: CourseMembership[], errors?: CourseMembershipRequestCreate[], callback?: () => void, httpError?: HttpErrorResponse }>(),

    "Update": props<{ key: string, request: CourseMembershipRequestUpdate }>(),
    "Update Success": props<{ response: Update<CourseMembership> }>(),
    "Update Failure": props<{ httpError: HttpErrorResponse }>(),

    "Delete": props<{ entity: CourseMembership }>(),
    "Delete Success": props<{ entity: CourseMembership }>(),
    "Delete Failure": props<{ httpError: HttpErrorResponse }>(),

    "Delete Many": props<{ keys: string[] }>(),
    "Delete Many Feedback": props<{ deletedKeys?: string[], errorKeys?: string[], httpError?: HttpErrorResponse }>()
  }
});
