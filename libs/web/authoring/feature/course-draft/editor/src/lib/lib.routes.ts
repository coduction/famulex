import { Route }                                        from "@angular/router";
import { Right }                                        from "@famulex/shared/famulex-api-client";
import { AuthGuard }                                    from "@famulex/shared/security/util";
import { CourseDraftListEffects, CourseDraftListState } from "@famulex/web/authoring/data-access/course-draft-list-state";
import { CourseDraftListComponent }                     from "@famulex/web/authoring/feature/course-draft/list";
import { MainLayoutComponent }                          from "@famulex/web/shared/layout";
import { provideEffects }                               from "@ngrx/effects";
import { provideState }                                 from "@ngrx/store";
import { CourseDraftEditorComponent }                   from "./editor/editor.component";

export const courseDraftEditorRoutes: Route[] = [
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      rights: [Right.ManageCourses, Right.CreateCourses]
    },
    providers: [
      provideState(CourseDraftListState),
      provideEffects(CourseDraftListEffects)
    ],
    children: [
      {
        path: "",
        component: CourseDraftListComponent
      },
      {
        path: ":courseDraftKey",
        component: CourseDraftEditorComponent
      }
    ]
  }
];
