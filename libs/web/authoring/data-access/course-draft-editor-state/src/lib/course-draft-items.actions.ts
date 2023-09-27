import { HttpErrorResponse }                    from "@angular/common/http";
import { CourseDraftItem, FilePermission }      from "@famulex/shared/famulex-api-client";
import { Update }                               from "@ngrx/entity";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const CourseDraftItemsActions = createActionGroup({
  source: "Authoring - Course Draft Items",
  events: {
    "Load": emptyProps(),
    "Load Success": props<{ response: CourseDraftItem[] }>(),
    "Load Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Update": props<{ key: string }>(),
    "Update Success": props<{ update: Update<CourseDraftItem> }>(),
    "Update Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Select": props<{ key: string }>(),
    "Update Content": props<{ key: string, content: string }>(),

    "Upload File": props<{ itemKey: string, file: File }>(),
    "Upload File Success": props<{ response: FilePermission }>(),
    "Upload File Failure": props<{ httpError?: HttpErrorResponse }>(),
    "Upload File Progress": props<{ progress?: number }>(),

    "Delete File Permission": props<{ filePermission: FilePermission }>(),
    "Delete File Permission Success": props<{ deletedFilePermission: FilePermission }>(),
    "Delete File Permission Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Upload Files": props<{ files: File[] }>(),
    "Upload Files Feedback": props<{ successes?: FilePermission[], errors?: File[] }>()
  }
});

