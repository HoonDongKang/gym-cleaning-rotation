<template>
  <v-app-bar elevation="1" color="white" height="64" class="px-6">
    <div class="d-flex align-center">
      <v-img
        :src="cleaningLogo"
        alt="Cleaning Rotation Logo"
        width="60"
        height="60"
        contain
        class="mr-3"
      />

      <v-toolbar flat color="transparent" class="pa-0 ma-0 elevation-0 transparent-toolbar">
        <v-toolbar-title class="text-h6 font-weight-bold text-grey-darken-4">
          Cleaning Gym
        </v-toolbar-title @click="">
      </v-toolbar>
    </div>

    <v-spacer />

    <!-- Navigation Menu -->
    <div class="d-flex align-center mr-8">
      <v-btn
        v-for="item in menuItems"
        :key="item.name"
        variant="text"
        color="grey-darken-2"
        class="mx-2"
        @click="navigateTo(item.route)"
      >
        {{ item.name }}
      </v-btn>
    </div>

    <!-- User Avatar -->
    <v-avatar size="40">
      <v-img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6RCMwJXvLaPVw13DR3ZOyj3eAQ-kX11lnS8-7AvMzPdJmZTQSlLAWSO2ecpOzfx8BtIPdD1cYXrocmQSuKazcvM6Vf201bd4kHDKcqQ4qd2va8kuVJWC_-PfqGbYPp41EQNGxiAXRWexN5rddKAnuHIqE01vYU58aUaineREc4bzFzKiwZWX9ck2ZQR34D4cmDXD3gS-DuMhXfIW6To6NMYZoEaa8KbzEGCPtvLK-2B0KkAqUW0Ag4mI4Ak1vsSXe3xr0GgqJuia3"
        alt="User Avatar"
      />
    </v-avatar>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';
import cleaningLogo from '@/assets/cleaning.png';

// Menu items
const menuItems = ref([
  { name: 'Home', route: '/' },
  { name: 'Members', route: '/members' },
  { name: 'Schedule', route: '/schedule' },
  { name: 'Settings', route: '/settings' },
]);

// Navigation handler
const navigateTo = (route) => {
  // Implement your navigation logic here
  console.log(`Navigating to: ${route}`);
  // Example: router.push(route)
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
