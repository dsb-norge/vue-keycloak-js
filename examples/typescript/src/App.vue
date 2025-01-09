<script setup lang="ts">
import { useKeycloak, type VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js"

const keycloak: VueKeycloakInstance = useKeycloak()

function manuallyRefreshAccessToken() {
  // We set a high minValidity to force a token refresh
  keycloak.keycloak.updateToken(5000)
}
</script>

<template>
  <div>
    <h1>Typescript example</h1>
    <button @click="manuallyRefreshAccessToken">Manually refresh access token</button>
    <div class="half-n-half">
      <div class="container">
        <p>Using injected value</p>
        <textarea :value="JSON.stringify(keycloak, null, 4)" />
      </div>
      <div class="container">
        <p>Using globalProperties object $keycloak</p>
        <textarea :value="JSON.stringify($keycloak, null, 4)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  width: 48vw;
  height: 80vh;
}

.half-n-half {
  display: flex;
  flex-direction: row;
}

.container {
  margin: 10px;
}
</style>
