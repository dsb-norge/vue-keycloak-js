<script setup lang="ts">
import { HTTP } from '@/main'
import type { AxiosResponseHeaders } from 'axios'
import { ref } from 'vue'
import { useKeycloak } from '@dsb-norge/vue-keycloak-js'

const keycloak = useKeycloak()
const requestHeaders = ref<AxiosResponseHeaders | Partial<unknown> | undefined>()

function manuallyRefreshAccessToken() {
  // We set a high minValidity to force a token refresh
  keycloak.keycloak.updateToken(5000)
}

async function doAuthenticatedRequest() {
  // Doesn't really go anywhere, but as you see from the headers in the request
  // it contains the latest access token at all times
  const response = await HTTP.get('/api/protected')
  requestHeaders.value = response.config.headers
}
</script>

<template>
  <div>
    <h1>Axios interceptor</h1>
    <button @click="doAuthenticatedRequest">Trigger request</button>
    <button @click="manuallyRefreshAccessToken">Refresh access token</button>
    <div>
    <textarea :value="requestHeaders?.toString()" readonly></textarea>
    </div>
  </div>
</template>

<style scoped>
textarea {
  width: 48vw;
  height: 80vh;
}
</style>
