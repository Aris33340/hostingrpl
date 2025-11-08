<template>
  <div id="app" class="container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Notification :show="notification.show" :type="notification.type" :message="notification.message"
      @close="notification.show = false" />
    <Modal />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Notification from './components/Notification.vue';
import { notification } from './composables/useNotification'
import Modal from './components/Modal.vue';
</script>
<style>
.main-content {
  width: 100vw;
}
</style>