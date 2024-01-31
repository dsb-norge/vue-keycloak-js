import type {
  KeycloakConfig,
  KeycloakError,
  KeycloakInitOptions,
  KeycloakLoginOptions,
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

export interface Vue2Vue3App {
  prototype?: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observable?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provide?: any
}

export type VueKeycloakConfig = KeycloakConfig | string;

export interface VueKeycloakOptions {
  config?: VueKeycloakConfig;
  init?: KeycloakInitOptions;
  // This is not defined in keycloak
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logout?: any;
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
  // This is not defined in keycloak
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logoutFn?(options?: any): Promise<void> | void; // Keycloak logout function
  createLoginUrl?(options?: KeycloakLoginOptions): string; // Keycloak createLoginUrl function
  // This is not defined in keycloak
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createLogoutUrl?(options?: any): string; // Keycloak createLogoutUrl function
  createRegisterUrl?(options?: KeycloakLoginOptions): string; // Keycloak createRegisterUrl function
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
  timeSkew?: number; // The estimated time difference between the browser time and the Keycloak server in seconds. This value is just an estimation, but is accurate enough when determining if a token is expired or not.
  responseMode?: string; // Response mode passed in init (default value is fragment).
  responseType?: string; // Response type sent to Keycloak with login requests. This is determined based on the flow value used during initialization, but can be overridden by setting this value.
  hasRealmRole?(role: string): boolean; // Keycloak hasRealmRole function
  hasResourceRole?(role: string, resource?: string): boolean; // Keycloak hasResourceRole function
  token?: string; // The base64 encoded token that can be sent in the Authorization header in requests to services
  tokenParsed?: VueKeycloakTokenParsed; // The parsed token as a JavaScript object
  keycloak?: Keycloak; // The original keycloak instance 'as is' from keycloak-js adapter
}
