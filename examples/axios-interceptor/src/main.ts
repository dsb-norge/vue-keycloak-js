import { createApp } from 'vue'
import VueKeycloakJs, { useKeycloak } from '@dsb-norge/vue-keycloak-js'
import axios from 'axios'
import App from './App.vue'

export const HTTP = axios.create({
  baseURL: '/',
  timeout: 10_000
})

function initializeTokenInterceptor () {
  HTTP.interceptors.request.use(config => {
    const keycloak = useKeycloak()
    if (keycloak.authenticated) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
}

createApp(App)
  .use(VueKeycloakJs, {
    config: {
      url: 'http://localhost:8080',
      realm: 'vue',
      clientId: 'vue-client',
    },
    onReady() {
      initializeTokenInterceptor()
    },
  })
  .mount('#app')
