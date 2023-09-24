import { HttpErrorResponse }                    from "@angular/common/http";
import { CourseDraft }                          from "@famulex/shared/famulex-api-client";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const CourseDraftActions = createActionGroup({
  source: "Authoring - Course Draft",
  events: {
    "Leave Editor": emptyProps(),

    "Load": props<{ key: string }>(),
    "Load Success": props<{ response: CourseDraft }>(),
    "Load Failure": props<{ routingError: boolean, httpError?: HttpErrorResponse }>()
  }
});
