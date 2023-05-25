import { Route }                        from "@angular/router";
import { Right }                        from "@famulex/shared/famulex-api-client";
import { AuthGuard }                    from "@famulex/shared/security/util";
import { RoleEffects, RoleState }       from "@famulex/web/administration/data-access/role-state";
import { UserEffects, UserState }       from "@famulex/web/administration/data-access/user-state";
import { provideEffects }               from "@ngrx/effects";
import { provideState }                 from "@ngrx/store";
import { AdministrationShellComponent } from "./administration-shell.component";

export const administrationRoutes: Route[] = [
  {
    path: "",
    providers: [
      provideState(UserState),
      provideState(RoleState),
      provideEffects(UserEffects),
      provideEffects(RoleEffects)
    ],
    children: [
      {
        path: "",
        component: AdministrationShellComponent
      },
      {
        path: "users",
        canActivate: [AuthGuard],
        data: {
          rights: [Right.ManageUsers]
        },
        loadComponent: () => import("@famulex/web/administration/feature/user-list").then(c => c.UserListComponent)
      },
      {
        path: "groups",
        canActivate: [AuthGuard],
        data: {
          rights: [Right.ManageGroups]
        },
        loadComponent: () => import("@famulex/web/administration/feature/group-list").then(c => c.GroupListComponent)
      },
      {
        path: "roles",
        canActivate: [AuthGuard],
        data: {
          rights: [Right.ManageRoles]
        },
        loadComponent: () => import("@famulex/web/administration/feature/role-list").then(c => c.RoleListComponent)
      }

    ]
  }
];
