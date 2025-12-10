<template>
  <div class="relative w-full h-full">
    <Loading />
    <Notification :show="notification.show" :type="notification.type" :message="notification.message"
      @close="notification.show = false" />

    <Modal />
    <div class="flex flex-row w-full min-h-screen">
      <Sidebar class="sticky h-screen" v-if="!$route.meta.hideSidebar" />
      <div class="flex flex-col w-full h-full">
        <TopBar />
        <main class="flex-1 w-full overflow-x-hidden"> 
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from './components/TopBar.vue';
import { onMounted } from 'vue';
import Sidebar from './components/SideBar.vue';
import Notification from './components/Notification.vue';
import { notification } from './composables/useNotification'
import Modal from './components/Modal.vue';
import Loading from './components/Loading.vue';

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
/* .main-content {
  width: 100vw;
} */

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>