import { Route }                              from "@angular/router";
import { Right }                              from "@famulex/shared/famulex-api-client";
import { NotFoundComponent }                  from "@famulex/shared/security/ui";
import { AuthGuard }                          from "@famulex/shared/security/util";
import { SystemInfoEffects, SystemInfoState } from "@famulex/shared/system-info";
import { MainLayoutComponent }                from "@famulex/web/shared/layout";
import { provideEffects }                     from "@ngrx/effects";
import { provideState }                       from "@ngrx/store";

export const appRoutes: Route[] = [
  {
    path: "",
    providers: [
      provideState(SystemInfoState),
      provideEffects(SystemInfoEffects)
    ],
    children: [
      {
        path: "dashboard",
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: []
      },
      {
        path: "administration",
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        data: {
          rights: [Right.ManageUsers, Right.ManageGroups, Right.ManageRoles]
        },
        title: $localize`Administration`,
        loadChildren: () => import("@famulex/web/administration/feature/shell").then(m => m.administrationRoutes)
      },
      {
        path: "authoring/courses",
        canActivate: [AuthGuard],
        data: {
          rights: [Right.ManageCourses, Right.CreateCourses]
        },
        loadChildren: () => import("@famulex/web/authoring/feature/course-draft/editor").then(m => m.courseDraftEditorRoutes)
      },
      {
        path: "authoring/tests",
        canActivate: [AuthGuard],
        data: {
          rights: [Right.CreateTests, Right.ManageTests]
        },
        loadChildren: () => import("@famulex/web/authoring/feature/test-draft/editor").then(m => m.testDraftEditorRoutes)
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard"
      },
      {
        path: "**",
        pathMatch: "full",
        component: NotFoundComponent
      }
    ]
  }
];
