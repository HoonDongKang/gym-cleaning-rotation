<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderView from './views/HeaderView.vue';
</script>

<template>
  <v-app>
    <header-view />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
@media (min-width: 1024px) {
  #app {
    display: block;
    padding: 0 2rem;
  }
}
</style>
