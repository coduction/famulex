import { APP_BASE_HREF, PlatformLocation }                                              from "@angular/common";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi }                 from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom }                      from "@angular/core";
import { provideAnimations }                                                            from "@angular/platform-browser/animations";
import { provideRouter }                                                                from "@angular/router";
import { FamulexApiConfiguration, FamulexApiConfigurationParameters, FamulexApiModule } from "@famulex/shared/famulex-api-client";
import { KeycloakAngularModule, KeycloakBearerInterceptor, KeycloakService }            from "keycloak-angular";
import { appRoutes }                                                                    from "./app.routes";
import { envConfig, EnvService }                                                        from "./environment/environment.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFamulex,
      multi: true,
      deps: [EnvService, KeycloakService]
    },
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
      deps: [KeycloakService]
    },
    importProvidersFrom(KeycloakAngularModule, FamulexApiModule.forRoot(initializeFamulexApi))
  ]
};

export function initializeFamulex(env: EnvService, keycloak: KeycloakService): () => Promise<void> {
  return () => new Promise<void>((resolve, reject) => {
    env.loadEnvConfig()
      .then(() => keycloak.init({
        config: {
          url: envConfig.keycloakUrl,
          realm: envConfig.keycloakRealm,
          clientId: envConfig.keycloakClientId
        },
        initOptions: {
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/assets/keycloak/silent-check-sso.html"
        }
      }))
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}

export function initializeFamulexApi(): FamulexApiConfiguration {

  const params: FamulexApiConfigurationParameters = {
    basePath: envConfig.famulexApiUrl
  };

  return new FamulexApiConfiguration(params);
}
