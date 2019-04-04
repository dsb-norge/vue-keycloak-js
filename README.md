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

> To enable login-required set onLoad to login-required and pass to the init method:

> `keycloak.init({ onLoad: 'login-required' })`

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

> `Vue.use(VueKeyCloak, [options])`

Tell Vue to install the plugin, and optionally pass in a JavaScript object additional
configuration.

```javascript
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

Vue.use(VueKeyCloak)

// You can also pass in options. Check options reference below.
Vue.use(VueKeyCloak, options)
```

The plugin adds a `$keycloak` property to the global Vue instance.
This is actually a new Vue instance and can be used as such. It holds this data:

```
{
  ready: Boolean,            // Flag indicating whether Keycloak has initialised and is ready
  authenticated: Boolean,
  userName: String,          // Username from Keycloak. Collected from tokenParsed['preferred_username']
  fullName: String,          // Full name from Keycloak. Collected from tokenParsed['name']
  logoutFn: Function,        // App+Keycloak logout function
  loginFn: Function,         // App+Keycloak login function
  createLoginUrl: Function,  // Keycloak createLoginUrl function
  createLogoutUrl: Function, // Keycloak createLogoutUrl function
  hasRealmRole: Function,    // Keycloak hasRealmRole function
  hasResourceRole: Function, // Keycloak hasResourceRole function
  token: String,             // The base64 encoded token that can be sent in the Authorization header in requests to services
  tokenParsed: String        // The parsed token as a JavaScript object
}
```

## Options

You can pass in an object as options to the plugin. The following keys are valid options. See below for descpription.

|Key|Type|Default
|---|---|---|
| `config`|String &#124; Object|`window.__BASEURL__ + '/config'`
|`init`|Object|`{onLoad: 'login-required'}`
|`logout`|Object|
|`onReady`|Function(keycloak)|

### config

**IMPORTANT NOTE**

Currently, the plugin accepts a config object like this:

```
{
  authRealm: String,
  authUrl: String,
  authClientId: String,
  logoutRedirectUri: String
}
```

**This will be deprecated in the next major release.**

Thereafter, the config object, either returned from an endpoint (string) or
set directly (object), must be compatible with the Keycloak JS adapter constructor arguments.

The `logoutRedirectUri` must instead be defined in [`options.logout`](#logout)

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
instatiation.

One use case for this callback could be to instatiate and mount the Vue application. Then we are sure that the Keycloak
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

In conjuction with the above, you might find it useful to intercept e.g. axios and set the token on each request:

```javascript
function tokenInterceptor () {
  axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
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

## Develop and deploy

```bash
$ git clone https://github.com/dsb-norge/vue-keycloak-js.git
# Do some work, add and/or commit to git.
$ npm version patch
```

The command `npm version patch` will automatically run the build, push the branch upstream and publish the package to
the NPM registry
