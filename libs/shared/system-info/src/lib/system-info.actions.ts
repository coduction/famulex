import { HttpErrorResponse }                    from "@angular/common/http";
import { FilePermission, SystemInfo }           from "@famulex/shared/famulex-api-client";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const SystemInfoActions = createActionGroup({
  source: "System Info",
  events: {
    "Load": emptyProps(),
    "Load Success": props<{ systemInfo: SystemInfo }>(),
    "Load Failure": props<{ error: HttpErrorResponse }>(),
    "Upload Logo": props<{ file: Blob }>(),
    "Upload Logo Success": props<{ logoPermission: FilePermission }>(),
    "Upload Logo Failure": props<{ error: HttpErrorResponse }>(),
    "Upload Compact Logo": props<{ file: Blob }>(),
    "Delete Logo": emptyProps(),
    "Delete Logo Success": emptyProps(),
    "Delete Logo Failure": props<{ error: HttpErrorResponse }>(),
    "Upload Compact Logo Success": props<{ compactLogoPermission: FilePermission }>(),
    "Upload Compact Logo Failure": props<{ error: HttpErrorResponse }>(),
    "Delete Compact Logo": emptyProps(),
    "Delete Compact Logo Success": emptyProps(),
    "Delete Compact Logo Failure": props<{ error: HttpErrorResponse }>()
  }
});
