import { HttpErrorResponse }                    from "@angular/common/http";
import { PageRole, Role, RoleRequest }          from "@famulex/shared/famulex-api-client";
import { LoadDataEvent }                        from "@famulex/web/shared/table";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const RoleActions = createActionGroup({
  source: "Administration - Roles",
  events: {
    "Load": props<{ event?: LoadDataEvent }>(),
    "Load Success": props<{ page: PageRole }>(),
    "Load Failure": props<{ error: HttpErrorResponse }>(),
    "Create": props<{ request: RoleRequest }>(),
    "Create Success": props<{ role: Role }>(),
    "Create Failure": props<{ error: HttpErrorResponse }>(),
    "Update": props<{ key: string, request: RoleRequest }>(),
    "Update Success": props<{ update: Update<Role> }>(),
    "Update Failure": props<{ error: HttpErrorResponse }>(),
    "Delete": props<{ role: Role }>(),
    "Delete Success": props<{ role: Role }>(),
    "Delete Failure": props<{ error?: HttpErrorResponse }>(),
    "Delete Many": props<{ keys: string[] }>(),
    "Delete Many Feedback": props<{ deletedKeys?: string[], errorKeys?: string[], error?: HttpErrorResponse }>(),
    "Clear": emptyProps()
  }
});
