import { HttpErrorResponse }                    from "@angular/common/http";
import { Group, GroupRequest, PageGroup }       from "@famulex/shared/famulex-api-client";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const GroupActions = createActionGroup({
  source: "Administration - Groups",
  events: {
    "Load Groups": emptyProps(),
    "Load Groups Success": props<{ page: PageGroup }>(),
    "Load Groups Failure": props<{ error: HttpErrorResponse }>(),
    "Add Group": props<{ groupRequest: GroupRequest }>(),
    "Add Group Success": props<{ group: Group }>(),
    "Add Group Failure": props<{ error: HttpErrorResponse }>(),
    "Update Group": props<{ id: string, groupRequest: GroupRequest }>(),
    "Update Group Success": props<{ group: Update<Group> }>(),
    "Update Group Failure": props<{ error: HttpErrorResponse }>(),
    "Delete Group": props<{ id: string }>(),
    "Delete Group Success": props<{ group: Group }>(),
    "Delete Group Failure": props<{ error: HttpErrorResponse }>(),
    "Delete Groups": props<{ ids: string[] }>(),
    "Delete Groups Success": props<{ groups: Group[] }>(),
    "Delete Groups Failure": props<{ error: HttpErrorResponse }>(),
    "Clear Groups": emptyProps(),
    "Set Pagination": props<{ page: number, pageSize: number, sortedBy: string[] }>()
  }
});
