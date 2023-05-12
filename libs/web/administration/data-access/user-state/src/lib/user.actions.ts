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
    "Add User": props<{ userRequest: UserRequest }>(),
    "Add User Success": props<{ user: User }>(),
    "Add User Failure": props<{ error: HttpErrorResponse }>(),
    "Update User": props<{ id: string, userRequest: UserRequest }>(),
    "Update User Success": props<{ user: Update<User> }>(),
    "Update User Failure": props<{ error: HttpErrorResponse }>(),
    "Delete User": props<{ id: string }>(),
    "Delete User Success": props<{ user: User }>(),
    "Delete User Failure": props<{ error: HttpErrorResponse }>(),
    "Delete Users": props<{ ids: string[] }>(),
    "Delete Users Success": props<{ users: User[] }>(),
    "Delete Users Failure": props<{ error: HttpErrorResponse }>(),
    "Clear Users": emptyProps(),
    "Set Pagination": props<{ page: number, pageSize: number, sortedBy: string[] }>()
  }
});
