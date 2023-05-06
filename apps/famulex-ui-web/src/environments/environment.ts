import { KeycloakOptions } from "keycloak-angular";

const keycloakUrl = "https://sso.coduction.com/auth";
const keycloakConfig: KeycloakOptions = {
  config: {
    url: keycloakUrl,
    realm: "famulex",
    clientId: "ui-web"
  },
  initOptions: {
    onLoad: "check-sso",
    silentCheckSsoRedirectUri:
      window.location.origin + "/assets/keycloak/silent-check-sso.html"
  },
  loadUserProfileAtStartUp: true
};

export const environment = {
  production: false,
  keycloakOptions: keycloakConfig,
  keycloakUrl: keycloakUrl,

  apiBasePath: "https://latest.famulex.com/api",
  websocketPath: "wss://latest.famulex.com/api/ws"
};
