import { HttpErrorResponse }                    from "@angular/common/http";
import { PageUser, User, UserRequest }          from "@famulex/shared/famulex-api-client";
import { LoadDataEvent }                        from "@famulex/web/shared/table";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const UserActions = createActionGroup({
  source: "Administration - Users",
  events: {
    "Load": props<{ event?: LoadDataEvent }>(),
    "Load Success": props<{ page: PageUser }>(),
    "Load Failure": props<{ error: HttpErrorResponse }>(),

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
