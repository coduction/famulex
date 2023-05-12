import { Route }               from "@angular/router";
import { NotFoundComponent }   from "@famulex/shared/security/ui";
import { AuthGuard }           from "@famulex/shared/security/util";
import { MainLayoutComponent } from "@famulex/web/shared/layout";
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
  },
  {
    path: "administration",
    component: MainLayoutComponent,
    loadChildren: () => import("@famulex/web/administration/feature/shell").then(m => m.administrationRoutes)
  },
  {
    path: "**",
    pathMatch: "full",
    component: NotFoundComponent
  }
];
