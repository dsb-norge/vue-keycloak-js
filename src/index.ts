import Keycloak from 'keycloak-js'
import type {
  VueKeycloakConfig,
  VueKeycloakOptions,
  VueKeycloakInstance,
  KeycloakError,
  VueKeycloakTokenParsed, Vue2Vue3App
} from './types'

let installed = false

const KeycloakSymbol = Symbol('keycloak')

import * as vue from 'vue'

export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  install: async function (app: Vue2Vue3App, params: VueKeycloakOptions = {}) {
    if (installed) return
    installed = true

    const defaultParams: VueKeycloakOptions = {
      config: window.__BASEURL__ ? `${window.__BASEURL__}/config` : '/config',
      init: { onLoad: 'login-required' },
    }
    const options = Object.assign({}, defaultParams, params)
    if (assertOptions(options).hasError)
      throw new Error(`Invalid options given: ${assertOptions(options).error}`)

    const watch = await vue2AndVue3Reactive(
      app,
      defaultEmptyVueKeycloakInstance()
    )
    getConfig(options.config)
      .then((config: VueKeycloakConfig) => {
        init(config, watch, options)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  KeycloakSymbol
}

function defaultEmptyVueKeycloakInstance(): VueKeycloakInstance {
  return {
    ready: false,
    authenticated: false,
    userName: null,
    fullName: null,
    token: null,
    tokenParsed: null,
    logoutFn: null,
    loginFn: null,
    login: null,
    createLoginUrl: null,
    createLogoutUrl: null,
    createRegisterUrl: null,
    register: null,
    accountManagement: null,
    createAccountUrl: null,
    loadUserProfile: null,
    subject: null,
    idToken: null,
    idTokenParsed: null,
    realmAccess: null,
    resourceAccess: null,
    refreshToken: null,
    refreshTokenParsed: null,
    timeSkew: null,
    responseMode: null,
    responseType: null,
    hasRealmRole: null,
    hasResourceRole: null,
    keycloak: null,
  }
}

function vue2AndVue3Reactive(app: Vue2Vue3App, object: VueKeycloakInstance): Promise<VueKeycloakInstance> {
  return new Promise((resolve, reject) => {
    if (app.prototype) {
      // Vue 2
      try {
        const reactiveObj = app.observable(object)
        Object.defineProperty(app.prototype, '$keycloak', {
          get() {
            return reactiveObj
          }
        })
        resolve(reactiveObj)
      } catch (e) {
        reject(e)
      }
    } else {
      // Vue 3
      // Assign an object immediately to allow usage of $keycloak in view

      //const vue = await import('vue')
      // Async load module to allow vue 2 to not have the dependency.
      const reactiveObj = vue.reactive(object)
      // Override the existing reactiveObj so references contains the new reactive values
      app.config.globalProperties.$keycloak =  reactiveObj
      // Use provide/inject in Vue3 apps
      app.provide(KeycloakSymbol, reactiveObj)
      resolve(reactiveObj)
    }
  })
}

function init(config: VueKeycloakConfig, watch: VueKeycloakInstance, options:VueKeycloakOptions) {
  const keycloak = Keycloak(config)

  keycloak.onReady = function (authenticated) {
    updateWatchVariables(authenticated)
    watch.ready = true
    typeof options.onReady === 'function' && options.onReady(keycloak, watch)
  }
  keycloak.onAuthSuccess = function () {
    // Check token validity every 10 seconds (10 000 ms) and, if necessary, update the token.
    // Refresh token if it's valid for less then 60 seconds
    const updateTokenInterval = setInterval(
      () =>
        keycloak.updateToken(60).catch(() => {
          keycloak.clearToken()
        }),
      10000
    )
    watch.logoutFn = () => {
      clearInterval(updateTokenInterval)
      keycloak.logout(options.logout)
    }
  }
  keycloak.onAuthRefreshSuccess = function () {
    updateWatchVariables(true)
  }
  keycloak.onAuthRefreshError = function () {
    updateWatchVariables(false)
    typeof options.onAuthRefreshError === 'function' &&
    options.onAuthRefreshError(keycloak)
  }
  keycloak
    .init(options.init)
    .then((authenticated) => {
      updateWatchVariables(authenticated)
      typeof options.onInitSuccess === 'function' &&
      options.onInitSuccess(authenticated)
    })
    .catch((err:KeycloakError) => {
      updateWatchVariables(false)
      const error = Error('Could not initialized keycloak-js adapter')
      typeof options.onInitError === 'function'
        ? options.onInitError(error, err)
        : console.error(error, err)
    })

  function updateWatchVariables(isAuthenticated = false) {
    watch.authenticated = isAuthenticated
    watch.loginFn = keycloak.login
    watch.login = keycloak.login
    watch.createLoginUrl = keycloak.createLoginUrl
    watch.createLogoutUrl = keycloak.createLogoutUrl
    watch.createRegisterUrl = keycloak.createRegisterUrl
    watch.register = keycloak.register
    watch.keycloak = keycloak
    if (isAuthenticated) {
      watch.accountManagement = keycloak.accountManagement
      watch.createAccountUrl = keycloak.createAccountUrl
      watch.hasRealmRole = keycloak.hasRealmRole
      watch.hasResourceRole = keycloak.hasResourceRole
      watch.loadUserProfile = keycloak.loadUserProfile
      watch.token = keycloak.token
      watch.subject = keycloak.subject
      watch.idToken = keycloak.idToken
      watch.idTokenParsed = keycloak.idTokenParsed
      watch.realmAccess = keycloak.realmAccess
      watch.resourceAccess = keycloak.resourceAccess
      watch.refreshToken = keycloak.refreshToken
      watch.refreshTokenParsed = keycloak.refreshTokenParsed
      watch.timeSkew = keycloak.timeSkew
      watch.responseMode = keycloak.responseMode
      watch.responseType = keycloak.responseType
      watch.tokenParsed = keycloak.tokenParsed
      watch.userName = (keycloak.tokenParsed as VueKeycloakTokenParsed)['preferred_username']
      watch.fullName = (keycloak.tokenParsed as VueKeycloakTokenParsed)['name']
    }
  }
}

function assertOptions(options: VueKeycloakOptions) {
  const { config, init, onReady, onInitError, onAuthRefreshError } = options
  if (typeof config !== 'string' && !_isObject(config)) {
    return {
      hasError: true,
      error: `'config' option must be a string or an object. Found: '${config}'`,
    }
  }
  if (!_isObject(init) || typeof init.onLoad !== 'string') {
    return {
      hasError: true,
      error: `'init' option must be an object with an 'onLoad' property. Found: '${init}'`,
    }
  }
  if (onReady && typeof onReady !== 'function') {
    return {
      hasError: true,
      error: `'onReady' option must be a function. Found: '${onReady}'`,
    }
  }
  if (onInitError && typeof onInitError !== 'function') {
    return {
      hasError: true,
      error: `'onInitError' option must be a function. Found: '${onInitError}'`,
    }
  }
  if (onAuthRefreshError && typeof onAuthRefreshError !== 'function') {
    return {
      hasError: true,
      error: `'onAuthRefreshError' option must be a function. Found: '${onAuthRefreshError}'`,
    }
  }
  return {
    hasError: false,
    error: null,
  }
}

function _isObject(obj: unknown) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj) !== '[object Array]'
  )
}

function getConfig(config: VueKeycloakConfig) {
  if (_isObject(config)) return Promise.resolve(config)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', config as string)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(Error(xhr.statusText))
        }
      }
    }
    xhr.send()
  })
}
