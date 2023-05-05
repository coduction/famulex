import { KeycloakOptions } from "keycloak-angular";

const keycloakUrl = "https://famulex.localhost/auth";
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
  }
};

export const environment = {
  production: false,
  keycloakOptions: keycloakConfig,
  keycloakUrl: keycloakUrl,

  apiBasePath: "https://famulex.localhost/api",
  websocketPath: "wss://famulex.localhost/api/ws"
};
