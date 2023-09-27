import { APP_BASE_HREF, LocationStrategy, PlatformLocation }                            from "@angular/common";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi }                 from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode }           from "@angular/core";
import { provideAnimations }                                                            from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding }                                     from "@angular/router";
import { ConfirmationService, MessageService }                                          from "@coduction/primeng/api";
import { DialogService }                                                                from "@coduction/primeng/dynamicdialog";
import { FamulexApiConfiguration, FamulexApiConfigurationParameters, FamulexApiModule } from "@famulex/shared/famulex-api-client";
import { HttpErrorInterceptor, JsonDateInterceptor }                                    from "@famulex/shared/util";
import { WizardEffects, WizardState }                                                   from "@famulex/web/shared/wizard";
import { provideEffects }                                                               from "@ngrx/effects";
import { provideRouterStore, routerReducer }                                            from "@ngrx/router-store";
import { provideState, provideStore }                                                   from "@ngrx/store";
import { provideStoreDevtools }                                                         from "@ngrx/store-devtools";
import { KeycloakAngularModule, KeycloakBearerInterceptor, KeycloakService }            from "keycloak-angular";
import { appRoutes }                                                                    from "./app.routes";
import { envConfig, EnvService }                                                        from "./environment/env.service";

export const appConfig: ApplicationConfig = {
  providers: [
    // provideRouter(appRoutes, withPreloading(PreloadAllModules)), TODO Alex: Currently preloading is not respecting the canMatch / canLoad guards. Check later and implement own preloading strategy if needed
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    // Disable strict immutability checks for now, because of the following issue: Wizards cannot be opened by passing a component as input if strict immutability checks are enabled
    provideStore(
      { router: routerReducer },
      { runtimeChecks: { strictActionImmutability: false } }
    ),
    provideRouterStore(),
    provideState(WizardState),
    provideEffects(WizardEffects),
    provideStoreDevtools({
      maxAge: 100,
      logOnly: !isDevMode()
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFamulex,
      multi: true,
      deps: [LocationStrategy, EnvService, KeycloakService]
    },
    DialogService,
    MessageService,
    ConfirmationService,
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JsonDateInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
      deps: [KeycloakService]
    },
    importProvidersFrom(
      FamulexApiModule.forRoot(initializeFamulexApi),
      KeycloakAngularModule
    )
  ]
};

export function initializeFamulex(
  locationStrategy: LocationStrategy,
  env: EnvService,
  keycloak: KeycloakService
): () => Promise<void> {
  return () =>
    new Promise<void>((resolve, reject) => {
      env
        .loadEnvConfig()
        .then(() =>
          keycloak.init({
            config: {
              url: envConfig.keycloakUrl,
              realm: envConfig.keycloakRealm,
              clientId: envConfig.keycloakClientId
            },
            initOptions: {
              onLoad: "check-sso",
              silentCheckSsoRedirectUri:
                window.location.origin +
                locationStrategy.prepareExternalUrl(
                  "/assets/keycloak/silent-check-sso.html"
                )
            }
          })
        )
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
