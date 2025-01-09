import type {
  KeycloakConfig,
  KeycloakError,
  KeycloakInitOptions,
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
  KeycloakProfile,
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakTokenParsed,
} from 'keycloak-js'

import Keycloak from 'keycloak-js'

export {
  KeycloakConfig,
  KeycloakError,
  KeycloakInitOptions,
  Keycloak,
  KeycloakLoginOptions,
  KeycloakProfile,
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakTokenParsed,
}

export type VueKeycloakConfig = KeycloakConfig | string;

export interface VueKeycloakOptions {
  config?: VueKeycloakConfig;
  init?: KeycloakInitOptions;
  logout?: KeycloakLogoutOptions | undefined;
  updateInterval?: number;
  onReady?: (
    keycloak: Keycloak,
    VueKeycloak?: VueKeycloakInstance
  ) => void;
  onInitError?: (error: Error, err: KeycloakError) => void;
  onAuthLogout?: (keycloak: Keycloak) => void;
  onAuthRefreshError?: (keycloak: Keycloak) => void;
  onAuthRefreshSuccess?: (keycloak: Keycloak) => void;
  onInitSuccess?(authenticated: boolean): void;
}

export interface VueKeycloakTokenParsed extends KeycloakTokenParsed {
  preferred_username?: string;
  name?: string;
}

export interface VueKeycloakInstance {
  ready: boolean; // Flag indicating whether Keycloak has initialised and is ready
  authenticated: boolean;
  userName?: string; // Username from Keycloak. Collected from tokenParsed['preferred_username']
  fullName?: string; // Full name from Keycloak. Collected from tokenParsed['name']
  login?(options?: KeycloakLoginOptions): Promise<void>; // [Keycloak] login function
  loginFn?(options?: KeycloakLoginOptions): Promise<void>; // Alias for login
  logoutFn?(options?: Keycloak['logout']): Promise<void> | void; // Keycloak logout function
  createLoginUrl?(options?: KeycloakLoginOptions): Promise<string>; // Keycloak createLoginUrl function
  createLogoutUrl?(options?: KeycloakLogoutOptions): string; // Keycloak createLogoutUrl function
  createRegisterUrl?(options?: KeycloakLoginOptions): Promise<string>; // Keycloak createRegisterUrl function
  register?(options?: KeycloakLoginOptions): Promise<void>; // Keycloak register function
  accountManagement?(): Promise<void>; // Keycloak accountManagement function
  createAccountUrl?(): string; // Keycloak createAccountUrl function
  loadUserProfile?(): Promise<KeycloakProfile>; // Keycloak loadUserProfile function
  subject?: string; // The user id
  idToken?: string; // The base64 encoded ID token.
  idTokenParsed?: VueKeycloakTokenParsed; // The parsed id token as a JavaScript object.
  realmAccess?: KeycloakRoles; // The realm roles associated with the token.
  resourceAccess?: KeycloakResourceAccess; // The resource roles associated with the token.
  refreshToken?: string; // The base64 encoded refresh token that can be used to retrieve a new token.
  refreshTokenParsed?: VueKeycloakTokenParsed; // The parsed refresh token as a JavaScript object.
  timeSkew?: number; // The estimated time difference between the browser time and the Keycloak server in seconds.
  responseMode?: string; // Response mode passed in init (default value is fragment).
  responseType?: string; // Response type sent to Keycloak with login requests.
  hasRealmRole?(role: string): boolean; // Keycloak hasRealmRole function
  hasResourceRole?(role: string, resource?: string): boolean; // Keycloak hasResourceRole function
  token?: string; // The base64 encoded token that can be sent in the Authorization header in requests to services
  tokenParsed?: VueKeycloakTokenParsed; // The parsed token as a JavaScript object
  keycloak?: Keycloak; // The original keycloak instance from keycloak-js adapter
}
