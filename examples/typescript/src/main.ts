import { createApp } from 'vue'
import VueKeycloakJs, { type VueKeycloakInstance } from '@dsb-norge/vue-keycloak-js'
import App from './App.vue'

createApp(App)
  .use(VueKeycloakJs, {
    config: {
      url: 'http://localhost:8080',
      realm: 'vue',
      clientId: 'vue-client',
    },
    onReady (keycloak) {
      console.log('Keycloak ready', keycloak)
    }
  })
  .mount('#app')

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties  {
    $keycloak: VueKeycloakInstance
  }
}
