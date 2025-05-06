vue-keycloak plugin
-------------------

![npm](https://img.shields.io/npm/v/@dsb-norge/vue-keycloak-js.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/@dsb-norge/vue-keycloak-js.svg?style=flat-square)
![NPM](https://img.shields.io/npm/l/@dsb-norge/vue-keycloak-js.svg?style=flat-square)

## Introduction

This plugin uses the official Keycloak JS adapter
https://github.com/keycloak/keycloak/tree/main/js/libs/keycloak-js

Please read the documentation:
https://www.keycloak.org/securing-apps/javascript-adapter

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

## Installation

### Install using npm

```
npm install @dsb-norge/vue-keycloak-js --save
```

### Install using yarn

```
yarn add @dsb-norge/vue-keycloak-js
```

## Usage

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

### Getting access to keycloak properties/functions

```vue
<script>
import { useKeycloak } from '@dsb-norge/vue-keycloak-js'

export default {
  setup() {
    const keycloak = useKeycloak()

    // Use the properties/functions

    return {
      keycloak
    }
  }
}
</script>

<template>
  <p>{{ keycloak.authenticated }}</p>
</template>
```

Or with compile-time syntactic sugar
```vue
<script setup>
import { useKeycloak } from '@dsb-norge/vue-keycloak-js'

const keycloak = useKeycloak()

// Use the properties/functions
</script>

<template>
  <p>{{ keycloak.authenticated }}</p>
</template>
```

The plugin also adds a `$keycloak` property to the global Vue instance.
This shadows most of the keycloak instance's properties and functions.
All other variables & functions can be found on `$keycloak.keycloak` attribute

```vue
<template>
  <p>{{ $keycloak.authenticated }}</p>
</template>
```

This object from both of these methods is [reactive](https://v3.vuejs.org/guide/reactivity-fundamentals.html#declaring-reactive-state) and will update with new tokens and other information
automatically.

These properties/functions are exposed:

```
{
  ready: Boolean,              // Flag indicating whether Keycloak has initialised and is ready
  authenticated: Boolean,      // Flag indicating whether the user is authenticated
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

|          Key           |              Type              |             Default              |
| ---------------------- | ------------------------------ | -------------------------------- |
| `config`               | String &#124; Object           | `window.__BASEURL__ + '/config'` |
| `init`                 | Object                         | `{onLoad: 'login-required'}`     |
| `logout`               | Object                         |                                  |
| `onReady`              | Function(keycloak)             |                                  |
| `onInitError`          | Function(error, keycloakError) |                                  |
| `onInitSuccess`        | Function(authenticated)        |                                  |
| `onAuthLogout`         | Function(keycloak)             |                                  |
| `onAuthRefreshError`   | Function(keycloak)             |                                  |
| `onAuthRefreshSuccess` | Function(keycloak)             |                                  |

### config

The config object, either returned from an endpoint (string) or
set directly (object), must be compatible with the [Keycloak JS adapter](https://www.keycloak.org/securing-apps/javascript-adapter#_using_the_adapter) constructor arguments.

See description below.

#### String

If this option is a string, the plugin will treat it as an URL and make an HTTP GET request to it.

If not present, the plugin will look for a global variable `window.__BASEURL__` and prepend it to `'/config'` and use
this a default place to make a GET request.

If no `window.__BASEURL__` exists, `/config` is used.

The return value from the request is used as constructor parameters for the Keycloak adapter.
As such, it should be an object with valid keys/values.

[See Keycloak's Javascript adapter reference](https://www.keycloak.org/securing-apps/javascript-adapter#_using_the_adapter)

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

If this option is an object, it will be passed on as constructor parameters for the [Keycloak adapter](https://www.keycloak.org/securing-apps/javascript-adapter#_using_the_adapter).
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
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

createApp(App)
  .use(VueKeyCloak, {
    onReady: (keycloak) => {
      console.log(`I wonder what Keycloak returns: ${keycloak}`)
    }
  })
  .mount('#app')
```

In conjunction with the above, you might find it useful to intercept e.g. axios and set the token on each request:

```javascript
function tokenInterceptor () {
  axios.interceptors.request.use(config => {
    const keycloak = useKeycloak()
    if (keycloak.authenticated) {
      // Note that this is a simple example.
      // you should be careful not to leak tokens to third parties.
      // in this example the token is added to all usage of axios.
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
}

createApp(App)
  .use(VueKeyCloak, {
    onReady: (keycloak) => {
      tokenInterceptor()
    }
  })
  .mount('#app')
```

### onInitError

This option is a callback function that is executed if Keycloak initialisation has failed.

The callback function has one parameter, which is the error object returned by Keycloak. Note that this may be undefined
even though an error has occurred, as Keycloak does not return an error object in every error case.

### onInitSuccess

This option is a callback function that is executed if Keycloak initialisation has succeeded.

The callback function has one parameter, which is the `authenticated` value returned by Keycloak's `init` method.

### onAuthLogout

This option is a callback function that is executed if the user is logged out (will only be called if the session status iframe is enabled, or in Cordova mode).

The callback function has one parameter, which is the keycloak object returned from the Keycloak adapter on
instantiation.

### onAuthRefreshError

This option is a callback function that is executed if there was an error while trying to refresh the token.

The callback function has one parameter, which is the keycloak object returned from the Keycloak adapter on
instantiation.

### onAuthRefreshSuccess

This option is a callback function that is executed when the token is refreshed.

The callback function has one parameter, which is the keycloak object returned from the Keycloak adapter on
instantiation.

## Examples

### Supply a configuration object for the Keycloak constructor

```javascript
createApp(App)
  .use(VueKeyCloak, {
    config: {
      realm: 'MyRealm',
      url: 'https://my.keycloak.server',
      clientId: 'MyClientId'
    }
  })
  .mount('#app')
```

### Supply init option (disable monitoring login state)

```javascript
createApp(App)
  .use(VueKeyCloak, {
    init: {
      onLoad: 'login-required',
      checkLoginIframe: false
    },
  })
  .mount('#app')
```

### Supply init option (use `check-sso`)

Remember; `login-required` is the default value for the onLoad property
in the init object. So without passing an `init` object as argument, the default is
`{ init: 'login-required' }`


##### To avoid waiting for configuration endpoint before loading vue app:
```javascript
createApp(App)
  .use(VueKeyCloak, {
    init: {
      onLoad: 'check-sso'
    },
  })
  .mount('#app')
```

##### Wait until keycloak adapter is ready before loading vue app:
```javascript
const app = createApp(App)
app.use(VueKeyCloak, {
  init: {
    onLoad: 'check-sso'
  },
  onReady: kc => {
    app.mount('#app')
  }
})
```

### Example applications

You can find different examples in the [examples](./examples) folder.


#### Simple 'in component' secret displaying properties/functions: [simple](https://github.com/dsb-norge/vue-keycloak-js/tree/master/examples/simple)

#### Simple example written in TypeScript: [typescript](https://github.com/dsb-norge/vue-keycloak-js/tree/master/examples/typescript)

#### Example with axios interceptors showing how to do secure requests: [axios-interceptor](https://github.com/dsb-norge/vue-keycloak-js/tree/master/examples/axios-interceptor)


## How to release

```bash
$ git checkout main
$ npm version [major | minor | patch ]
$ git push
$ git push --tags
```

Go to GitHub and create a new release based on the latest tag.
GitHub Actions will then build and publish the release to npmjs.com.

## Frequently asked questions

We try to answer the most frequently asked questions here.

### Localhost !== 127.0.0.1

Note that if you run keycloak on your own machine it is important to be consistent with the settings for its address. Cookies created from 127.0.0.1 will not be sent to "localhost" and vice versa.
