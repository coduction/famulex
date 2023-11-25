import { HttpErrorResponse }                                                           from "@angular/common/http";
import { ActivatedRoute }                                                              from "@angular/router";
import { DynamicDialogRef }                                                            from "primeng/dynamicdialog";
import { CourseDraftNode, CourseDraftNodeRequestCreate, CourseDraftNodeRequestUpdate } from "@famulex/shared/famulex-api-client";
import { Update }                                                                      from "@ngrx/entity";
import { createActionGroup, emptyProps, props }                                        from "@ngrx/store";
import { CourseDraftNodeAction }                                                       from "./course-draft-nodes.models";


export const CourseDraftNodesActions = createActionGroup({
  source: "Authoring - Course Draft Nodes",
  events: {
    "Load": emptyProps,
    "Load Success": props<{ response: CourseDraftNode[] }>(),
    "Load Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Select Node": props<{ key: string, route?: ActivatedRoute }>(),
    "Deselect Node": emptyProps,

    "Create": props<{ request: CourseDraftNodeRequestCreate, dialog?: DynamicDialogRef }>(),
    "Create Success": props<{ response: CourseDraftNode, dialog?: DynamicDialogRef }>(),
    "Create Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Update": props<{ key: string, request: CourseDraftNodeRequestUpdate, dialog?: DynamicDialogRef }>(),
    "Update Success": props<{ update: Update<CourseDraftNode>, dialog?: DynamicDialogRef }>(),
    "Update Failure": props<{ httpError?: HttpErrorResponse }>(),

    "Delete": props<{ node: CourseDraftNode }>(),
    "Delete Success": props<{ node: CourseDraftNode }>(),
    "Delete Failure": props<{ node: CourseDraftNode, httpError?: HttpErrorResponse }>(),

    "Add Action": props<{ id: string, action: CourseDraftNodeAction }>(),
    "Remove Action": props<{ id: string }>(),
    "Clear Actions": emptyProps
  }
});
