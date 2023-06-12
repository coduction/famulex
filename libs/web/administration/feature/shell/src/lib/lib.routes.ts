import { Route }                        from "@angular/router";
import { Right }                        from "@famulex/shared/famulex-api-client";
import { AuthGuard }                    from "@famulex/shared/security/util";
import { GroupEffects, GroupState }     from "@famulex/web/administration/data-access/group-state";
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
      provideState(GroupState),
      provideEffects(UserEffects),
      provideEffects(RoleEffects),
      provideEffects(GroupEffects)
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
        title: $localize`Users`,
        loadComponent: () => import("@famulex/web/administration/feature/user-list").then(c => c.UserListComponent)
      },
      {
        path: "groups",
        canActivate: [AuthGuard],
        data: {
          rights: [Right.ManageGroups]
        },
        title: $localize`Groups`,
        loadComponent: () => import("@famulex/web/administration/feature/group-list").then(c => c.GroupListComponent)
      },
      {
        path: "roles",
        canActivate: [AuthGuard],
        data: {
          rights: [Right.ManageRoles]
        },
        title: $localize`Roles`,
        loadComponent: () => import("@famulex/web/administration/feature/security").then(c => c.RolesListComponent)
      }

    ]
  }
];
