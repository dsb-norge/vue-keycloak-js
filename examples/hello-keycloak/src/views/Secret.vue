<template>
  <div>
    <h1>This is a secret about page. You should only be able to see this if you are authenticated.</h1>
    <h3>This is what my token looks like:</h3>
    <code>{{ $keycloak.tokenParsed }}</code>
  </div>
</template>
