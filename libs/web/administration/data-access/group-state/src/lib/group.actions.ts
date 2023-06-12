import { HttpErrorResponse }                    from "@angular/common/http";
import { Group, GroupRequest, PageGroup }       from "@famulex/shared/famulex-api-client";
import { LoadDataEvent }                        from "@famulex/web/shared/table";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const GroupActions = createActionGroup({
  source: "Administration - Groups",
  events: {
    "Load": props<{ event?: LoadDataEvent }>(),
    "Load Success": props<{ page: PageGroup }>(),
    "Load Failure": props<{ error: HttpErrorResponse }>(),
    "Create": props<{ request: GroupRequest }>(),
    "Create Success": props<{ group: Group }>(),
    "Create Failure": props<{ error: HttpErrorResponse }>(),
    "Update": props<{ key: string, request: GroupRequest }>(),
    "Update Success": props<{ group: Update<Group> }>(),
    "Update Failure": props<{ error: HttpErrorResponse }>(),
    "Delete": props<{ group: Group }>(),
    "Delete Success": props<{ group: Group }>(),
    "Delete Failure": props<{ group: Group, error: HttpErrorResponse }>(),
    "Delete Many": props<{ keys: string[] }>(),
    "Delete Many Feedback": props<{ deletedKeys?: string[], errorKeys?: string[], error?: HttpErrorResponse }>(),
    "Clear": emptyProps()
  }
});
