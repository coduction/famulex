import { Injectable }                                          from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { KeycloakAuthGuard, KeycloakService }                  from "keycloak-angular";
import { AuthService }                                         from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard extends KeycloakAuthGuard {
  constructor(router: Router,
              keycloakService: KeycloakService,
              private authService: AuthService) {
    super(router, keycloakService);
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        console.warn("User not authenticated!");
        this.authService.login(route.url.toString());
        return resolve(false);
      }

      console.log("Expected role: ", route.data["roles"]);
      console.log("User roles :", this.roles);

      const requiredRoles = route.data["roles"];
      let granted = false;

      if (!requiredRoles || requiredRoles.length === 0) {
        granted = true;
      } else if (this.roles.indexOf("admin") != -1) {
        granted = true;
      } else {
        for (const requiredRole of requiredRoles) {
          if (this.roles.indexOf(requiredRole) > -1) {
            granted = true;
            break;
          }
        }
      }

      if (!granted) {
        console.warn("Access denied!");
        this.router.navigate(["/"]);
      } else {
        console.log("Access granted!");
      }

      return resolve(granted);
    });
  }
}
