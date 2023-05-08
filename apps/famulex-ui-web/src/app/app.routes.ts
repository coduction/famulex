import { Route }               from "@angular/router";
import { AuthGuard }           from "@famulex/shared/keycloak";
import { MainLayoutComponent } from "@famulex/shared/layout";
import { NxWelcomeComponent }  from "./nx-welcome.component";

export const appRoutes: Route[] = [
  {
    path: "ngrx-test",
    component: MainLayoutComponent,
    loadChildren: () =>
      import("@famulex/ngrx-test").then((m) => m.ngrxTestRoutes)
  },
  {
    path: "",
    pathMatch: "full",
    component: MainLayoutComponent,
    children: [
      {
        path: "protected",
        component: NxWelcomeComponent,
        data: {
          roles: ["manage_users"]
        },
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: "**",
    redirectTo: ""
  }
];
