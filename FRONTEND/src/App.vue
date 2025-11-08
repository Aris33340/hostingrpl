<template>
  <div id="app" class="main-content">
    <Navbar />
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
    <Notification :show="notification.show" :type="notification.type" :message="notification.message"
      @close="notification.show = false" />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Notification from './components/Notification.vue';
import {notification} from './composables/useNotification'
</script>

<style>
.main-content {
  width: 100vw;
}
</style>
