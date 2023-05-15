import { Injectable }                                                                                from "@angular/core";
import { ActivatedRouteSnapshot, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Right }                                                                                     from "@famulex/shared/famulex-api-client";
import { KeycloakAuthGuard, KeycloakService }                                                        from "keycloak-angular";
import { Observable }                                                                                from "rxjs";
import { AuthService }                                                                               from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard extends KeycloakAuthGuard implements CanMatch {
  constructor(
    router: Router,
    private keycloakService: KeycloakService,
    private authService: AuthService
  ) {
    super(router, keycloakService);
  }

  isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.checkAccess(route.url.toString(), route.data["rights"] as Right[]);
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // TODO Alex: Refactor this into functional guard since class based CanMatch is deprecated
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        this.authenticated = await this.keycloakService.isLoggedIn();
        this.roles = this.keycloakService.getUserRoles(true);

        const url = segments.join("/");
        let requiredRights: Right[] = [];

        if (route.data && route.data["rights"]) {
          requiredRights = route.data["rights"] as Right[];
        }

        this.checkAccess(url, requiredRights).then(result => {
          resolve(result);
        });
      } catch (error) {
        reject("An error happened during access validation. Details:" + error);
      }
    });
  }

  checkAccess(url: string, requiredRights: Right[]): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      //if (!this.authenticated) {
      if (!await this.keycloakService.isLoggedIn()) {
        console.warn("User not authenticated!");
        return this.authService.login(url).then(() => resolve(false));
      }

      // console.debug("Expected rights: ", requiredRights);
      // console.debug("User rights :", this.roles);

      let granted = false;

      if (!requiredRights || requiredRights.length === 0) {
        granted = true;
      } else if (this.roles.indexOf("admin") != -1) {
        granted = true;
      } else {
        for (const requiredRole of requiredRights) {
          if (this.roles.indexOf(requiredRole) > -1) {
            granted = true;
            break;
          }
        }
      }

      if (!granted) {
        console.warn("Access denied!");
        void this.router.navigate(["/"]);
      }

      return resolve(granted);
    });
  }
}
