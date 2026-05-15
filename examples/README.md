# vue-keycloak-js example

## Prerequisites

You must have a Keycloak server running somewhere, with the correct
setup, eg. `redirectUri`, `clientId`, `realm` etc.

Or you could run: `docker-compose up` in this directory and get a temporary working keycloak instance.

> [!WARNING]
> This setup is intended for **local development only**. The Keycloak instance is published on `0.0.0.0:8080` with default credentials. Do **not** use this configuration on untrusted networks or in production.
>
> The keycloak instance will be set up with the following users:
> - `admin` with password `admin`
> - `user` with password `user`
>
> To administrate the keycloak instance, you can go to `http://localhost:8080/admin/` and login with the admin user.

## Simple example

Simple example of how to use `vue-keycloak-js` in a Vue application. and getting access to the keycloak object in the template

### Run it
1. `git clone https://github.com/dsb-norge/vue-keycloak-js.git`
2. `cd vue-keycloak-js/examples/simple`
3. `npm install`
4. `npm run dev`


## Typescript example

Simple example of how to use `vue-keycloak-js` in a Vue application with typescript.

### Run it
1. `git clone https://github.com/dsb-norge/vue-keycloak-js.git`
2. `cd vue-keycloak-js/examples/typescript`
3. `npm install`
4. `npm run dev`


## Axios interceptor example

Simple example of how to use `vue-keycloak-js` in a Vue application with Axios interceptor.
allowing you to do secured requests to your backend with the users access token.

### Run it
1. `git clone https://github.com/dsb-norge/vue-keycloak-js.git`
2. `cd vue-keycloak-js/examples/axios-interceptor`
3. `npm install`
4. `npm run dev`
