import { HttpErrorResponse }                                                           from "@angular/common/http";
import { ActivatedRoute }                                                              from "@angular/router";
import { CourseDraftNode, CourseDraftNodeRequestCreate, CourseDraftNodeRequestUpdate } from "@famulex/shared/famulex-api-client";
import { Update }                                                                      from "@ngrx/entity";
import { createActionGroup, emptyProps, props }                                        from "@ngrx/store";


export const CourseDraftNodesActions = createActionGroup({
  source: "Authoring - Course Draft Nodes",
  events: {
    "Load": emptyProps,
    "Load Success": props<{ response: CourseDraftNode[] }>(),
    "Load Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Select Node": props<{ key: string, route?: ActivatedRoute }>(),

    "Create": props<{ request: CourseDraftNodeRequestCreate }>(),
    "Create Success": props<{ response: CourseDraftNode }>(),
    "Create Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Update": props<{ nodeKey: string, request: CourseDraftNodeRequestUpdate }>(),
    "Update Success": props<{ update: Update<CourseDraftNode> }>(),
    "Update Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Delete": props<{ node: CourseDraftNode }>(),
    "Delete Success": props<{ node: CourseDraftNode }>(),
    "Delete Failure": props<{ httpError?: HttpErrorResponse }>()
  }
});
