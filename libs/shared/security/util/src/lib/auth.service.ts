import { LocationStrategy }                                  from "@angular/common";
import { Injectable }                                        from "@angular/core";
import { Right }                                             from "@famulex/shared/famulex-api-client";
import { KeycloakEvent, KeycloakEventType, KeycloakService } from "keycloak-angular";
import { KeycloakProfile }                                   from "keycloak-js";
import { Subject }                                           from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private _authenticated = false;
  private _profile: KeycloakProfile | undefined;
  private _keycloakEvents: Subject<KeycloakEvent> = this.keycloakService.keycloakEvents$;

  constructor(
    private keycloakService: KeycloakService,
    private locationStrategy: LocationStrategy
  ) {
    this.loadUserProfile();

    this._keycloakEvents.subscribe({
      next: (e: KeycloakEvent) => {
        if (e.type == KeycloakEventType.OnAuthSuccess) {
          console.log("Keycloak event: AuthSuccess");
          this._authenticated = true;
        }
        if (e.type == KeycloakEventType.OnAuthLogout) {
          console.log("Keycloak event: AuthLogout");
          this._authenticated = false;
        }
        if (e.type == KeycloakEventType.OnTokenExpired) {
          console.log("Keycloak event: TokenExpired");
          keycloakService.updateToken();
        }
        if (e.type == KeycloakEventType.OnAuthRefreshSuccess) {
          console.log("Keycloak event: AuthRefreshSuccess");
        }
      }
    });
  }

  public login(redirectUrlSegment?: string): Promise<void> {
    const redirectUrl =
      window.location.origin +
      this.locationStrategy.prepareExternalUrl(
        redirectUrlSegment !== undefined ? redirectUrlSegment : ""
      );

    console.log("Starting Keycloak login. Redirect Uri: " + redirectUrl);
    return this.keycloakService
      .login({ redirectUri: redirectUrl })
      .then(() => this.loadUserProfile());
  }

  public logout() {
    const redirectUrl =
      window.location.origin + this.locationStrategy.prepareExternalUrl("/");

    this.keycloakService
      .logout(redirectUrl)
      .then(() => {
        this._authenticated = false;
        this._profile = undefined;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private loadUserProfile() {
    this.keycloakService
      .isLoggedIn()
      .then(() => this.keycloakService.loadUserProfile())
      .then((profile) => {
        this._authenticated = true;
        this._profile = profile;
      })
      .catch(() => {
        this._authenticated = false;
        this._profile = undefined;
      });
  }

  private textWithDefault(text: string | null | undefined): string {
    return text ? text : "";
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  get username(): string {
    return this.textWithDefault(this._profile?.username);
  }

  get userKey(): string {
    return this.textWithDefault(this._profile?.id);
  }

  get fullName(): string {
    const firstname = this.textWithDefault(this._profile?.firstName);
    const lastname = this.textWithDefault(this._profile?.lastName);

    return (firstname ? firstname + " " : "") + lastname;
  }

  get rights(): Right[] {
    return this.keycloakService.getUserRoles() as Right[];
  }
}
