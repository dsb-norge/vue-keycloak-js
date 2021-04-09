<template>
  <div id="app">
    <div class="hello">
      <h1>Welcome to Your Vue + Keycloak App</h1>
    </div>
    <Secret />
  </div>
</template>

<script>
import Secret from '@/components/Secret'

export default {
  name: 'App',
  components: {
    Secret
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
