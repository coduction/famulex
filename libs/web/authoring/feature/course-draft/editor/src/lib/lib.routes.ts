import { Route }                    from "@angular/router";
import { Right }                    from "@famulex/shared/famulex-api-client";
import { AuthGuard }                from "@famulex/shared/security/util";
import {
  CourseDraftEffects, CourseDraftItemsEffects, CourseDraftItemsState, CourseDraftNodesEffects, CourseDraftNodesState, CourseDraftState
}                                   from "@famulex/web/authoring/data-access/course-draft-editor-state";
import {
  CourseDraftListEffects, CourseDraftListState
}                                   from "@famulex/web/authoring/data-access/course-draft-list-state";
import {
  CourseMembershipsEffects, CourseMembershipsState
}                                   from "@famulex/web/authoring/data-access/course-memberships-state";
import { CourseDraftListComponent } from "@famulex/web/authoring/feature/course-draft/list";
import { MainLayoutComponent }      from "@famulex/web/shared/layout";
import { provideEffects }           from "@ngrx/effects";
import { provideState }             from "@ngrx/store";
import {
  CourseDraftContentComponent
}                                   from "./course-draft-content/course-draft-content.component";
import {
  courseDraftContentGuard
}                                   from "./course-draft-content/course-draft-content.guard";
import {
  CourseDraftEditorComponent
}                                   from "./course-draft-editor/course-draft-editor.component";
import { courseDraftStateGuard }    from "./course-draft-editor/course-draft-state.guard";
import {
  CourseDraftMembershipsComponent
}                                   from "./course-draft-memberships/course-draft-memberships.component";
import {
  CourseDraftNodeContentComponent
}                                   from "./course-draft-node-content/course-draft-node-content.component";
import {
  courseDraftNodeContentGuard, courseDraftNodeRestoreGuard
}                                   from "./course-draft-node-content/course-draft-node-content.guard";

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
        component: CourseDraftEditorComponent,
        providers: [
          provideState(CourseDraftState),
          provideState(CourseDraftNodesState),
          provideState(CourseDraftItemsState),
          provideState(CourseMembershipsState),
          provideEffects(CourseDraftEffects),
          provideEffects(CourseDraftNodesEffects),
          provideEffects(CourseDraftItemsEffects),
          provideEffects(CourseMembershipsEffects)
        ],
        canActivate: [courseDraftStateGuard],
        children: [
          {
            path: "content",
            component: CourseDraftContentComponent,
            canActivate: [courseDraftContentGuard],

            children: [
              {
                path: ":nodeKey",
                component: CourseDraftNodeContentComponent,
                canActivate: [courseDraftNodeContentGuard]
              },
              {
                path: "**",
                children: [],
                canActivate: [courseDraftNodeRestoreGuard]
              }
            ]
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
