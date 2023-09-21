import { Route }                                            from "@angular/router";
import { Right }                                            from "@famulex/shared/famulex-api-client";
import { AuthGuard }                                        from "@famulex/shared/security/util";
import { CourseDraftEditorEffects, CourseDraftEditorState } from "@famulex/web/authoring/data-access/course-draft-editor-state";
import { CourseDraftListEffects, CourseDraftListState }     from "@famulex/web/authoring/data-access/course-draft-list-state";
import { CourseMembershipsEffects, CourseMembershipsState } from "@famulex/web/authoring/data-access/course-memberships-state";
import { CourseDraftListComponent }                         from "@famulex/web/authoring/feature/course-draft/list";
import { MainLayoutComponent }                              from "@famulex/web/shared/layout";
import { provideEffects }                                   from "@ngrx/effects";
import { provideState }                                     from "@ngrx/store";
import { CourseDraftMembershipsComponent }                  from "./course-draft-memberships/course-draft-memberships.component";
import { CourseDraftStructureComponent }                    from "./course-draft-structure/course-draft-structure.component";
import { CourseDraftEditorComponent }                       from "./editor/editor.component";

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
      provideState(CourseMembershipsState),
      provideEffects(CourseDraftListEffects),
      provideEffects(CourseMembershipsEffects)
    ],
    children: [
      {
        path: "",
        component: CourseDraftListComponent
      },
      {
        path: ":courseDraftKey",
        component: CourseDraftEditorComponent,
        providers: [
          provideState(CourseDraftEditorState),
          provideEffects(CourseDraftEditorEffects)
        ],
        children: [
          {
            path: "content",
            component: CourseDraftStructureComponent
          },
          {
            path: "memberships",
            component: CourseDraftMembershipsComponent
          },
          {
            path: "**",
            redirectTo: "content"
          }
        ]
      }
    ]
  }
];
