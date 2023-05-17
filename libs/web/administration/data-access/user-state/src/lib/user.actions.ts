import { HttpErrorResponse }                    from "@angular/common/http";
import { PageUser, User, UserRequest }          from "@famulex/shared/famulex-api-client";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const UserActions = createActionGroup({
  source: "Administration - Users",
  events: {
    "Load Users": emptyProps(),
    "Load Users Success": props<{ page: PageUser }>(),
    "Load Users Failure": props<{ error: HttpErrorResponse }>(),
    "Create User": props<{ userRequest: UserRequest }>(),
    "Create User Success": props<{ user: User }>(),
    "Create User Failure": props<{ error: HttpErrorResponse }>(),
    "Update User": props<{ key: string, userRequest: UserRequest }>(),
    "Update User Success": props<{ user: Update<User> }>(),
    "Update User Failure": props<{ error: HttpErrorResponse }>(),
    "Delete User": props<{ user: User }>(),
    "Delete User Success": props<{ user: User }>(),
    "Delete User Failure": props<{ error?: HttpErrorResponse, isCurrentUser?: boolean }>(),
    "Delete Users": props<{ keys: string[] }>(),
    "Delete Users Feedback": props<{ deletedKeys?: string[], errorKeys?: string[], error?: HttpErrorResponse, containsCurrentUser?: boolean }>(),
    "Clear Users": emptyProps(),
    "Set Pagination": props<{ page: number, pageSize: number, sortedBy: string[] }>()
  }
});
