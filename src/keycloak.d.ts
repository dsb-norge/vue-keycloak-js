import Vue, { PluginObject, PluginFunction } from "vue";

export class VueKeyCloakInstance {
  ready: boolean; // Flag indicating whether Keycloak has initialised and is ready
  authenticated: boolean;
  userName: string; // Username from Keycloak. Collected from tokenParsed['preferred_username']
  fullName: string; // Full name from Keycloak. Collected from tokenParsed['name']
  login: Function; // [Keycloak] login function
  loginFn: Function; // Alias for login
  logoutFn: Function; // Keycloak logout function
  createLoginUrl: Function; // Keycloak createLoginUrl function
  createLogoutUrl: Function; // Keycloak createLogoutUrl function
  createRegisterUrl: Function; // Keycloak createRegisterUrl function
  register: Function; // Keycloak register function
  accountManagement: Function; // Keycloak accountManagement function
  createAccountUrl: Function; // Keycloak createAccountUrl function
  loadUserProfile: Function; // Keycloak loadUserProfile function
  loadUserInfo: Function; // Keycloak loadUserInfo function
  subject: string; // The user id
  idToken: string; // The base64 encoded ID token.
  idTokenParsed: object; // The parsed id token as a JavaScript object.
  realmAccess: object; // The realm roles associated with the token.
  resourceAccess: object; // The resource roles associated with the token.
  refreshToken: string; // The base64 encoded refresh token that can be used to retrieve a new token.
  refreshTokenParsed: object; // The parsed refresh token as a JavaScript object.
  timeSkew: number; // The estimated time difference between the browser time and the Keycloak server in seconds. This value is just an estimation, but is accurate enough when determining if a token is expired or not.
  responseMode: string; // Response mode passed in init (default value is fragment).
  responseType: string; // Response type sent to Keycloak with login requests. This is determined based on the flow value used during initialization, but can be overridden by setting this value.
  hasRealmRole: Function; // Keycloak hasRealmRole function
  hasResourceRole: Function; // Keycloak hasResourceRole function
  token: string; // The base64 encoded token that can be sent in the Authorization header in requests to services
  tokenParsed: string; // The parsed token as a JavaScript object
}

export type VueKeyCloakOptions = {
  config?: {
    authUrl?: string;
    authRealm?: string;
    authClientId?: string;
    logoutRedirectUri?: string;
  };
  init?: {
    onLoad: string;
  };
  onReady(keycloak: VueKeyCloakInstance): void;
};

export default class VueKeyCloak implements PluginObject<VueKeyCloakOptions> {
  [key: string]: any;
  install: PluginFunction<VueKeyCloakOptions>;
  static install(
    pVue: typeof Vue,
    options?: VueKeyCloakOptions | undefined
  ): void;

  constructor(options: VueKeyCloakOptions);
}
