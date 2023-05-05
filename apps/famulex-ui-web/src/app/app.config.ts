import { APP_BASE_HREF, PlatformLocation }                              from "@angular/common";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig }                           from "@angular/core";
import { provideAnimations }                                            from "@angular/platform-browser/animations";
import { provideRouter }                                                from "@angular/router";
import { KeycloakBearerInterceptor, KeycloakService }                   from "keycloak-angular";
import { environment }                                                  from "../environments/environment";
import { appRoutes }                                                    from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    KeycloakService,
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
      deps: [KeycloakService]
    }
  ]
};

export function initializeKeycloak(keycloakService: KeycloakService) {
  return () => keycloakService.init(environment.keycloakOptions);
}
