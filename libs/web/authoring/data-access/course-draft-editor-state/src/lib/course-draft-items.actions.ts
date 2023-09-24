import { HttpErrorResponse }                    from "@angular/common/http";
import { CourseDraftItem, FilePermission }      from "@famulex/shared/famulex-api-client";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const CourseDraftItemsActions = createActionGroup({
  source: "Authoring - Course Draft Items",
  events: {
    "Load": emptyProps(),
    "Load Success": props<{ response: CourseDraftItem[] }>(),
    "Load Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Select Item": props<{ key: string }>(),

    "Upload File": props<{ itemKey: string, file: File }>(),
    "Upload File Success": props<{ response: FilePermission }>(),
    "Upload File Failure": props<{ httpError?: HttpErrorResponse }>(),
    "Upload File Progress": props<{ progress?: number }>(),

    "Upload Files": props<{ files: File[] }>(),
    "Upload Files Feedback": props<{ successes?: FilePermission[], errors?: File[] }>()
  }
});
