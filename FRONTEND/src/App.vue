<template>
  <div id="app" class="container">

    <Navbar v-if="!$route.meta.hideSidebar" />

    <main class="main-content">
      <router-view />
    </main>

    <Notification 
      :show="notification.show" 
      :type="notification.type" 
      :message="notification.message"
      @close="notification.show = false" 
    />

    <Modal />
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { onMounted } from 'vue';
=======
>>>>>>> origin/tya
import Navbar from './components/Navbar.vue';
import Notification from './components/Notification.vue';
import { notification } from './composables/useNotification'
import Modal from './components/Modal.vue';

<<<<<<< HEAD

=======
>>>>>>> origin/tya
// $route sudah tersedia secara global di dalam <template>,
// jadi tidak perlu impor 'useRoute' dari 'vue-router'
</script>

<style>
/* Error CSS diperbaiki. 
  Komentar saya pindahkan ke sini agar aman.
  
  CATATAN: Style ini mungkin perlu Anda sesuaikan nanti. 
  Jika Navbar adalah sidebar vertikal, 'width: 100vw' 
  mungkin akan terdorong ke samping.
*/
.main-content {
  width: 100vw;
}
</style>