<template>
  <div class="mx-10">

    <div class="switch-wrapper">
      <div class="switch-container">

        <button class="switch-item" :class="{ active: activeTab === 'buat' }" @click="activeTab = 'buat'">
          Buat Undangan
        </button>

        <button class="switch-item" :class="{ active: activeTab === 'riwayat' }" @click="activeTab = 'riwayat'">
          Riwayat Pengiriman Undangan
        </button>

      </div>
    </div>

    <div class="content-area">
      <BuatUndangan v-if="activeTab === 'buat'" />

      <RiwayatUndangan v-else />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import BuatUndangan from '../components/manajemen-undangan/BuatUndangan.vue';
import RiwayatUndangan from '../components/manajemen-undangan/RiwayatUndangan.vue';

// State untuk menyimpan tab mana yang sedang aktif
// Default: 'buat'
const activeTab = ref('buat');
</script>

/* src/views/ManajemenUndangan.vue */

<style scoped>

.page-header {
  background: white;
  border-radius: 12px;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  color: #3B5998;
  font-weight: 700;
  margin: 0;
}

/* --- REVISI POIN 1: Switch di Kiri --- */
.switch-wrapper {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-start;
  /* Ini kuncinya: Rata Kiri */
}

.switch-container {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
  border-radius: 50px;
  backdrop-filter: blur(5px);
}

.switch-item {
  background: transparent;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.switch-item.active {
  background: white;
  color: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-item:not(.active) {
  color: #444;
}

.content-area {
  /* Opsional: Tambahkan jika konten butuh background putih penuh */
}
</style>