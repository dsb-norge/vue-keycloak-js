<template>
  <div>
    <div v-if="$keycloak && $keycloak.ready">
      <div v-if="$keycloak.authenticated">
        <h2>You should only be able to see this if you are authenticated.</h2>
        <h3>This is what my token looks like:</h3>
        <code>{{ $keycloak.tokenParsed }}</code>
        <h3>This is your access token:</h3>
        <code>{{ $keycloak.token }}</code>
        <br />
        <button @click="$keycloak.logoutFn">Logout</button>
        <button @click="$keycloak.keycloak.updateToken(300)">Refresh token</button>
      </div>
      <div v-else>
        <h1>Not authenticated</h1>
        <button @click="$keycloak.login">Login</button>
      </div>
    </div>
  </div>
</template>
