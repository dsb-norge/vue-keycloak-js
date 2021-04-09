import Vue from 'vue'
import App from './App.vue'
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js'

Vue.config.productionTip = false

Vue.use(VueKeycloakJs, {
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
  onReady (keycloak) {
    console.log(keycloak)
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
