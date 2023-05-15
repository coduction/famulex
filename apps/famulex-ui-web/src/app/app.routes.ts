import { Route }               from "@angular/router";
import { Right }               from "@famulex/shared/famulex-api-client";
import { NotFoundComponent }   from "@famulex/shared/security/ui";
import { AuthGuard }           from "@famulex/shared/security/util";
import { MainLayoutComponent } from "@famulex/web/shared/layout";
import { NxWelcomeComponent }  from "./nx-welcome.component";

export const appRoutes: Route[] = [
  {
    path: "",
    component: MainLayoutComponent,
    canMatch: [AuthGuard],
    children: [
      {
        path: "protected",
        component: NxWelcomeComponent,
        data: {
          roles: ["manage_users"]
        },
        canMatch: [AuthGuard]
      }
    ]
  },
  {
    path: "administration",
    component: MainLayoutComponent,
    canMatch: [AuthGuard],
    data: {
      rights: [Right.ManageUsers]
    },
    loadChildren: () => import("@famulex/web/administration/feature/shell").then(m => m.administrationRoutes)
  },
  {
    path: "**",
    pathMatch: "full",
    component: NotFoundComponent
  }
];
