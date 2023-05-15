import { Route }                        from "@angular/router";
import { UserEffects, UserState }       from "@famulex/web/administration/data-access/user-state";
import { provideEffects }               from "@ngrx/effects";
import { provideState }                 from "@ngrx/store";
import { AdministrationShellComponent } from "./administration-shell.component";

export const administrationRoutes: Route[] = [
  {
    path: "",
    providers: [
      provideState(UserState),
      provideEffects(UserEffects)
    ],
    children: [
      {
        path: "",
        component: AdministrationShellComponent
      },
      {
        path: "users",
        loadComponent: () => import("@famulex/web/administration/feature/user-list").then(c => c.UserListComponent)
      },
      {
        path: "groups",
        loadComponent: () => import("@famulex/web/administration/feature/group-list").then(c => c.GroupListComponent)
      },
      {
        path: "roles",
        loadComponent: () => import("@famulex/web/administration/feature/role-list").then(c => c.RoleListComponent)
      }

    ]
  }
];
