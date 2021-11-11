import { createApp } from 'vue'
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js'
import App from './App.vue'
import {KeycloakInstance} from "keycloak-js";
import {VueKeycloakInstance} from "@dsb-norge/vue-keycloak-js/dist/types";

createApp(App)
  .use(VueKeycloakJs, {
    init: {
      // Use 'login-required' to always require authentication
      // If using 'login-required', there is no need for the router guards in router.js
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html"
    },
    config: {
      url: 'http://localhost:8085/auth',
      clientId: 'vue-client',
      realm: 'vue'
    },
    onReady (keycloak: KeycloakInstance) {
      console.log('Keycloak ready', keycloak)
    }
  })
  .mount('#app')

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties  {
    $keycloak: VueKeycloakInstance
  }
}
