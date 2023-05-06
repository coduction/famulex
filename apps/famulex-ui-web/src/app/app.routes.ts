import { Route }               from "@angular/router";
import { AuthGuard }           from "@famulex/shared/keycloak";
import { MainLayoutComponent } from "@famulex/shared/layout";
import { NxWelcomeComponent }  from "./nx-welcome.component";

export const appRoutes: Route[] = [
  {
    path: "",
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
  }
];
