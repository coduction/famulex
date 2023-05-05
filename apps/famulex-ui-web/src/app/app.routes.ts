import { Route }              from "@angular/router";
import { AuthGuard }          from "@famulex/shared/keycloak";
import { NxWelcomeComponent } from "./nx-welcome.component";

export const appRoutes: Route[] = [
  {
    path: "protected",
    component: NxWelcomeComponent,
    data: {
      roles: ["manage_users"]
    },
    canActivate: [AuthGuard]
  }
];
