import { APP_BASE_HREF }                                     from "@angular/common";
import { Inject, Injectable }                                from "@angular/core";
import { KeycloakEvent, KeycloakEventType, KeycloakService } from "keycloak-angular";
import { KeycloakProfile }                                   from "keycloak-js";
import { Subject }                                           from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {

  private _authenticated = false;
  private _profile: KeycloakProfile | undefined;
  private _keycloakEvents: Subject<KeycloakEvent> = this.keycloakService.keycloakEvents$;

  constructor(private keycloakService: KeycloakService,
              @Inject(APP_BASE_HREF) private baseHref: string) {
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
    const redirectUrl = window.location.origin + this.baseHref + (redirectUrlSegment !== undefined ? redirectUrlSegment : "");

    console.log("Starting Keycloak login. Redirect Uri: " + redirectUrl);
    return this.keycloakService.login({ redirectUri: redirectUrl }).then(() => {
      this.loadUserProfile();
    });
  }

  public logout() {
    const redirectUrl = window.location.origin + this.baseHref + "/";

    this.keycloakService.logout(redirectUrl)
      .then(() => {
        this._authenticated = false;
        this._profile = undefined;
      })
      .catch(error => {
        console.error(error);
      });
  }

  private loadUserProfile() {
    this.keycloakService.isLoggedIn()
      .then(() => this.keycloakService.loadUserProfile())
      .then(profile => {
        console.log(profile);
        this._authenticated = true;
        this._profile = profile;
      })
      .catch(error => {
        this._authenticated = false;
        this._profile = undefined;
        console.log(error);
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

  get displayName(): string {
    const firstname = this.textWithDefault(this._profile?.firstName);
    const lastname = this.textWithDefault(this._profile?.lastName);

    return (firstname ? firstname + " " : "") + lastname;
  }
}
