import Keycloak from 'keycloak-js'
import type {
  VueKeycloakConfig,
  VueKeycloakOptions,
  VueKeycloakInstance,
  KeycloakError,
  VueKeycloakTokenParsed
} from './types'
import { type App, DeepReadonly, Reactive, reactive, readonly } from 'vue'

let installed = false
const keycloakStore: Reactive<VueKeycloakInstance> = reactive(defaultEmptyVueKeycloakInstance())

export default {
  install: function (app: App, params: VueKeycloakOptions = {}) {
    if (installed) return
    installed = true

    const defaultParams: VueKeycloakOptions = {
      config: window.__BASEURL__ ? `${window.__BASEURL__}/config` : '/config',
      init: { onLoad: 'login-required' },
    }
    const options = Object.assign({}, defaultParams, params)

    // Simplify option assertion
    const assertion = assertOptions(options)
    if (assertion.hasError)
      throw new Error(`Invalid options given: ${assertion.error}`)

    app.config.globalProperties.$keycloak =  readonly(keycloakStore)

    if (!options.config) {
      throw new Error('Keycloak config is required')
    }

    getConfig(options.config)
      .then((config: VueKeycloakConfig) => {
        init(config, keycloakStore, options)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export function useKeycloak (): DeepReadonly<VueKeycloakInstance> {
  return readonly(keycloakStore)
}

function defaultEmptyVueKeycloakInstance(): VueKeycloakInstance {
  return {
    ready: false,
    authenticated: false,
    userName: undefined,
    fullName: undefined,
    token: undefined,
    tokenParsed: undefined,
    logoutFn: undefined,
    loginFn: undefined,
    login: undefined,
    createLoginUrl: undefined,
    createLogoutUrl: undefined,
    createRegisterUrl: undefined,
    register: undefined,
    accountManagement: undefined,
    createAccountUrl: undefined,
    loadUserProfile: undefined,
    subject: undefined,
    idToken: undefined,
    idTokenParsed: undefined,
    realmAccess: undefined,
    resourceAccess: undefined,
    refreshToken: undefined,
    refreshTokenParsed: undefined,
    timeSkew: undefined,
    responseMode: undefined,
    responseType: undefined,
    hasRealmRole: undefined,
    hasResourceRole: undefined,
    keycloak: undefined,
  }
}

async function init(config: VueKeycloakConfig, store: Reactive<VueKeycloakInstance>, options: VueKeycloakOptions) {
  const keycloak = new Keycloak(config)
  const { updateInterval } = options

  function updateWatchVariables(isAuthenticated = false) {
    store.authenticated = isAuthenticated
    store.loginFn = keycloak.login
    store.login = keycloak.login
    store.createLoginUrl = keycloak.createLoginUrl
    store.createLogoutUrl = keycloak.createLogoutUrl
    store.createRegisterUrl = keycloak.createRegisterUrl
    store.register = keycloak.register
    store.keycloak = keycloak
    if (isAuthenticated) {
      store.accountManagement = keycloak.accountManagement
      store.createAccountUrl = keycloak.createAccountUrl
      store.hasRealmRole = keycloak.hasRealmRole
      store.hasResourceRole = keycloak.hasResourceRole
      store.loadUserProfile = keycloak.loadUserProfile
      store.token = keycloak.token
      store.subject = keycloak.subject
      store.idToken = keycloak.idToken
      store.idTokenParsed = keycloak.idTokenParsed
      store.realmAccess = keycloak.realmAccess
      store.resourceAccess = keycloak.resourceAccess
      store.refreshToken = keycloak.refreshToken
      store.refreshTokenParsed = keycloak.refreshTokenParsed
      store.timeSkew = keycloak.timeSkew
      store.responseMode = keycloak.responseMode
      store.responseType = keycloak.responseType
      store.tokenParsed = keycloak.tokenParsed
      store.userName = (keycloak.tokenParsed as VueKeycloakTokenParsed)['preferred_username']
      store.fullName = (keycloak.tokenParsed as VueKeycloakTokenParsed)['name']
    }
  }

  keycloak.onReady = function (authenticated: boolean) {
    updateWatchVariables(authenticated)
    store.ready = true
    if (typeof options.onReady === 'function') {
      options.onReady(keycloak, store)
    }
  }

  keycloak.onAuthSuccess = function () {
    const updateTokenInterval = setInterval(
      () => {
        keycloak.updateToken(60)
          .then((updated: boolean) => {
            if (options.init?.enableLogging) {
              console.log(`[vue-keycloak-js] Token ${updated ? 'updated' : 'not updated'}`)
            }
          })
          .catch((error: unknown) => {
            if (options.init?.enableLogging) {
              console.log(`[vue-keycloak-js] Error while updating token: ${error}`)
            }
            keycloak.clearToken()
          })},
      updateInterval ?? 10000
    )
    store.logoutFn = () => {
      clearInterval(updateTokenInterval)
      return keycloak.logout(options.logout)
    }
  }

  keycloak.onAuthRefreshSuccess = function () {
    updateWatchVariables(true)
    if (typeof options.onAuthRefreshSuccess === 'function') {
      options.onAuthRefreshSuccess(keycloak)
    }
  }

  keycloak.onAuthRefreshError = function () {
    updateWatchVariables(false)
    if (typeof options.onAuthRefreshError === 'function') {
      options.onAuthRefreshError(keycloak)
    }
  }

  keycloak.onAuthLogout = function () {
    updateWatchVariables(false)
    if (typeof options.onAuthLogout === 'function') {
      options.onAuthLogout(keycloak)
    }
  }

  try {
    const authenticated = await keycloak.init(options.init)
    updateWatchVariables(authenticated)
    if (typeof options.onInitSuccess === 'function') {
      options.onInitSuccess(authenticated)
    }
  } catch (err: unknown) {
    updateWatchVariables(false)
    const error = new Error('Failure during initialization of keycloak-js adapter', { cause: err })
    if (typeof options.onInitError === 'function') {
      options.onInitError(error, err as KeycloakError)
    } else {
      console.error(error, err)
    }
  }
}

function assertOptions(options: VueKeycloakOptions) {
  const { config, init, onReady, onInitError, onAuthRefreshError, onAuthLogout } = options
  if (typeof config !== 'string' && !_isObject(config)) {
    return {
      hasError: true,
      error: `'config' option must be a string or an object. Found: '${typeof config}'`,
    }
  }
  if (!_isObject(init) || typeof init?.onLoad !== 'string') {
    return {
      hasError: true,
      error: `'init' option must be an object with an 'onLoad' property. Found: '${init}'`,
    }
  }
  if (onReady && typeof onReady !== 'function') {
    return {
      hasError: true,
      error: `'onReady' option must be a function. Found: '${typeof onReady}'`,
    }
  }
  if (onInitError && typeof onInitError !== 'function') {
    return {
      hasError: true,
      error: `'onInitError' option must be a function. Found: '${typeof onInitError}'`,
    }
  }
  if (onAuthRefreshError && typeof onAuthRefreshError !== 'function') {
    return {
      hasError: true,
      error: `'onAuthRefreshError' option must be a function. Found: '${typeof onAuthRefreshError}'`,
    }
  }
  if (onAuthLogout && typeof onAuthLogout !== 'function') {
    return {
      hasError: true,
      error: `'onAuthLogout' option must be a function. Found: '${typeof onAuthLogout}'`,
    }
  }
  return {
    hasError: false,
    error: null,
  }
}

function getConfig(config: VueKeycloakConfig): Promise<VueKeycloakConfig> {
  if (_isObject(config)) return Promise.resolve(config)
  return fetch(config as string, { headers: { 'Accept': 'application/json' } })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`)
      }
      return response.json()
    })
}

function _isObject(obj: unknown) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj) !== '[object Array]'
  )
}
