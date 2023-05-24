import { Route }               from "@angular/router";
import { Right }               from "@famulex/shared/famulex-api-client";
import { NotFoundComponent }   from "@famulex/shared/security/ui";
import { AuthGuard }           from "@famulex/shared/security/util";
import { MainLayoutComponent } from "@famulex/web/shared/layout";

export const appRoutes: Route[] = [
  {
    path: "",
    component: MainLayoutComponent,
    children: []
  },
  {
    path: "administration",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      rights: [Right.ManageUsers, Right.ManageGroups, Right.ManageRoles]
    },
    loadChildren: () => import("@famulex/web/administration/feature/shell").then(m => m.administrationRoutes)
  },
  {
    path: "**",
    pathMatch: "full",
    component: NotFoundComponent
  }
];
