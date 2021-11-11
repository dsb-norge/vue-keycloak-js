<template>
  <div class="hello">
    <h1>Welcome to Your Vue + Keycloak App</h1>
  </div>
  <Secret />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Secret from "@/components/Secret.vue";

export default defineComponent({
  name: 'App',
  components: {
    Secret
  },
  created () {
    // Should work referencing custom property on 'this' in typescript
    console.log('App created', this.$keycloak)
  }
});
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
