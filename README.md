vue-keycloak plugin
-------------------

[![Known Vulnerabilities](https://snyk.io/test/github/dsb-norge/vue-keycloak-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dsb-norge/vue-keycloak-js?targetFile=package.json)
![npm](https://img.shields.io/npm/v/@dsb-norge/vue-keycloak-js.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/@dsb-norge/vue-keycloak-js.svg?style=flat-square)
![NPM](https://img.shields.io/npm/l/@dsb-norge/vue-keycloak-js.svg?style=flat-square)

## Introduction

This plugin uses the official Keycloak JS adapter
https://github.com/keycloak/keycloak-js-bower

Please read the documentation:
http://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter

#### Excerpt from Keycloak JS doc:

> By default to authenticate you need to call the login function. However, there are two options available to make the
adapter automatically authenticate. You can pass login-required or check-sso to the init function.
login-required will authenticate the client if the user is logged-in to Keycloak or display the login page if not.
check-sso will only authenticate the client if the user is already logged-in, if the user is not logged-in the browser
will be redirected back to the application and remain unauthenticated.
>
> To enable login-required set onLoad to login-required and pass to the init method:
>
> `keycloak.init({ onLoad: 'login-required' })`

## Note on Vue 3

Vue 3 support is in _beta_, starting from 2.0.0-beta. Any help is greatly appreciated!

When Vue 3 is fully supported, we will release version 2.0.0.

## Installation

### Install using yarn

```
yarn add @dsb-norge/vue-keycloak-js
```

### Install using npm

```
npm install @dsb-norge/vue-keycloak-js --save
```

## Usage

### Vue 2

> `Vue.use(VueKeyCloak, [options])`

Tell Vue to install the plugin, and optionally pass in a JavaScript object for additional configuration.

```javascript
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

Vue.use(VueKeyCloak)

// You can also pass in options. Check options reference below.
Vue.use(VueKeyCloak, options)
```

### Vue 3 (beta)

> `createApp(App).use(VueKeycloak, [options])`

Tell Vue to install the plugin, and optionally pass in a JavaScript object for additional configuration.

```javascript
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

createApp(App).use(VueKeycloak)

// You can also pass in options. Check options reference below.
createApp(App).use(VueKeycloak, options)
```

```typescript
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";

createApp(App).use(VueKeycloak)

// You can also pass in options. Check options reference below.
createApp(App).use(VueKeycloak, options)

// Allow usage of this.$keycloak in components
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties  {
    $keycloak: VueKeycloakInstance
  }
}
```

The plugin adds a `$keycloak` property to the global Vue instance.
This shadows most of the keycloak instance's properties and functions.
All other variables & functions can be found on `$keycloak.keycloak` attribute

Internally for Vue 2:
 * [Vue.observable](https://vuejs.org/v2/api/#Vue-observable)

Internally for Vue 3
* [reactive](https://v3.vuejs.org/guide/reactivity-fundamentals.html#declaring-reactive-state)

This object is reactive and will update with new tokens and other information

These properties/functions are exposed:

```
{
  ready: Boolean,              // Flag indicating whether Keycloak has initialised and is ready
  authenticated: Boolean,
  userName: String,            // Username from Keycloak. Collected from tokenParsed['preferred_username']
  fullName: String,            // Full name from Keycloak. Collected from tokenParsed['name']
  login: Function,             // [Keycloak] login function
  loginFn: Function,           // Alias for login
  logoutFn: Function,          // Keycloak logout function
  createLoginUrl: Function,    // Keycloak createLoginUrl function
  createLogoutUrl: Function,   // Keycloak createLogoutUrl function
  createRegisterUrl: Function, // Keycloak createRegisterUrl function
  register: Function,          // Keycloak register function
  accountManagement: Function, // Keycloak accountManagement function
  createAccountUrl: Function,  // Keycloak createAccountUrl function
  loadUserProfile: Function,   // Keycloak loadUserProfile function
  subject: String,             // The user id
  idToken: String,             // The base64 encoded ID token.
  idTokenParsed: Object,       // The parsed id token as a JavaScript object.
  realmAccess: Object,         // The realm roles associated with the token.
  resourceAccess: Object,      // The resource roles associated with the token.
  refreshToken: String,        // The base64 encoded refresh token that can be used to retrieve a new token.
  refreshTokenParsed: Object,  // The parsed refresh token as a JavaScript object.
  timeSkew: Number,            // The estimated time difference between the browser time and the Keycloak server in seconds. This value is just an estimation, but is accurate enough when determining if a token is expired or not.
  responseMode: String,        // Response mode passed in init (default value is fragment).
  responseType: String,        // Response type sent to Keycloak with login requests. This is determined based on the flow value used during initialization, but can be overridden by setting this value.
  hasRealmRole: Function,      // Keycloak hasRealmRole function
  hasResourceRole: Function,   // Keycloak hasResourceRole function
  token: String,               // The base64 encoded token that can be sent in the Authorization header in requests to services
  tokenParsed: String          // The parsed token as a JavaScript object
  keycloak: Object             // The original keycloak instance 'as is' from keycloak-js adapter
}
```

## Options

You can pass in an object as options to the plugin. The following keys are valid options. See below for description.

| Key           | Type                 | Default                          |
|---------------|----------------------|----------------------------------|
| `config`      | String &#124; Object | `window.__BASEURL__ + '/config'` |
| `init`        | Object               | `{onLoad: 'login-required'}`     |
| `logout`      | Object               |                                  |
| `onReady`     | Function(keycloak)   |                                  |
| `onInitError` | Function(error)      |                                  |

### config

The config object, either returned from an endpoint (string) or
set directly (object), must be compatible with the [Keycloak JS adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter) constructor arguments.

See description below.

#### String

If this option is a string, the plugin will treat it as an URL and make an HTTP GET request to it.

If not present, the plugin will look for a global variable `window.__BASEURL__` and prepend it to `'/config'` and use
this a default place to make a GET request.

If no `window.__BASEURL__` exists, `/config` is used.

The return value from the request is used as constructor parameters for the Keycloak adapter.
As such, it should be an object with valid keys/values.

[See Keycloak's Javascript adapter reference](https://www.keycloak.org/docs/latest/securing_apps/index.html#javascript-adapter-reference)

E.g.

```
{
  realm: String,
  url: String,
  clientId: String
}
```

These values will be used as constructor parameters to the official Keycloak adapter.

#### Object

If this option is an object, it will be passed on as constructor parameters for the [Keycloak adapter](https://www.keycloak.org/docs/latest/securing_apps/index.html#javascript-adapter-reference).
No HTTP GET request is done in this case.

### init

This option is the parameter object for the `Keycloak.init` method.

### logout

This option is the parameter object for the `Keycloak.logout` method.

### onReady

This option is a callback function that is executed once Keycloak has initialised and is ready. You can be sure
that the Vue instance has a property called `$keycloak` in this function. See above for possible values.

The callback function has one parameter, which is the keycloak object returned from the Keycloak adapter on
instantiation.

One use case for this callback could be to instantiate and mount the Vue application. Then we are sure that the Keycloak
authentication and the `$keycloak` property are properly finished and hydrated with data:

```javascript
Vue.use(VueKeyCloak, {
  onReady: (keycloak) => {
    console.log(`I wonder what Keycloak returns: ${keycloak}`)
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      template: '<App/>',
      render: h => h(App)
    })
  }
})
```

In conjunction with the above, you might find it useful to intercept e.g. axios and set the token on each request:

```javascript
function tokenInterceptor () {
  axios.interceptors.request.use(config => {
    if (Vue.prototype.$keycloak.authenticated) {
      config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
}

Vue.use(VueKeyCloak, {
  onReady: (keycloak) => {
    tokenInterceptor()
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      template: '<App/>',
      render: h => h(App)
    })
  }
})
```

### onInitError

This option is a callback function that is executed if Keycloak initialisation has failed.

The callback function has one parameter, which is the error object returned by Keycloak. Note that this may be undefined
even though an error has occurred, as Keycloak does not return an error object in every error case.

## Examples

### Supply a configuration object for the Keycloak constructor

```javascript
Vue.use(VueKeyCloak, {
  config: {
    realm: 'MyRealm',
    url: 'https://my.keycloak.server/auth',
    clientId: 'MyClientId'
  },
  onReady: kc => {
    new Vue({
      render: h => h(App)
    }).$mount('#app')
  }
})
```

### Supply init option (disable monitoring login state)

```javascript
Vue.use(VueKeyCloak, {
  init: {
    onLoad: 'login-required',
    checkLoginIframe: false
  },
  onReady: kc => {
    new Vue({
      render: h => h(App)
    }).$mount('#app')
  }
})
```

### Supply init option (use `check-sso`)

Remember; `login-required` is the default value for the onLoad property
in the init object. So without passing an `init` object as argument, the default is
`{ init: 'login-required' }`


##### To avoid waiting for configuration endpoint before loading vue app:
```javascript
Vue.use(VueKeyCloak, {
  init: {
    onLoad: 'check-sso'
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
```

##### Wait until keycloak adapter is ready before loading vue app:
```javascript
Vue.use(VueKeyCloak, {
  init: {
    onLoad: 'check-sso'
  },
  onReady: kc => {
    new Vue({
      render: h => h(App)
    }).$mount('#app')
  }
})
```

### Specify a `redirectUri`

```javascript
Vue.use(VueKeyCloak, {
  logout: {
    redirectUri: 'https://mydomain.lives.here.com'
  },
  onReady: kc => {
    new Vue({
      render: h => h(App)
    }).$mount('#app')
  }
})
```

### Example applications

View a complete example app, with router guards:

[hello-keycloak](https://github.com/dsb-norge/vue-keycloak-js/tree/master/examples/hello-keycloak)

Simple 'in component' secret displaying reactiveness:

[simple_vue2](https://github.com/dsb-norge/vue-keycloak-js/tree/master/examples/simple_vue2)

Typescript example with vue 3

[typescript_vue3](https://github.com/dsb-norge/vue-keycloak-js/tree/master/examples/typescript_vue3)


## Develop and deploy

```bash
$ git clone https://github.com/dsb-norge/vue-keycloak-js.git
# Do some work, add and/or commit to git.
$ npm version [major | minor | patch ]
$ git push --tags
```

Go to GitHub and create a new release based on the latest tag.
GitHub Actions will then build and publish the release to npmjs.com.

## Frequently asked questions

We try to answer the most frequently asked questions here.

### How can I specify client secret?

Short answer: You should not.

For some mysterious reasons, there is undocumented support for it in the Keycloak Javascript Adapter, but it makes little sense to use it. The secret must be present in the browser, and is therefore no longer a secret. See [issue 22](https://github.com/dsb-norge/vue-keycloak-js/issues/22).

The client secret is [removed from Keycloak 8.0](https://www.keycloak.org/docs/latest/release_notes/index.html#credentials-support-removed-from-the-javascript-adapter).

### Localhost !== 127.0.0.1

Note that if you run keycloak on your own machine it is important to be consistent with the settings for its address. Cookies created from 127.0.0.1 will not be sent to "localhost" and vice versa.
