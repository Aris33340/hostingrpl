<template>
  <div class="p-4">
    <button @click="generate"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
      Generate QR Codes
    </button>

    <div v-if="encrypted.length">
      <h2 class="mb-2 font-bold">Generated QR Codes:</h2>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="(code, index) in encrypted" :key="index" class="flex flex-col items-center">
          <qrcode-canvas :value="code" :size="1080" level="H" />
          <span class="mt-1 text-sm">{{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { QrcodeCanvas } from 'qrcode.vue';
import api from "@/api";
import { showNotification } from '../composables/useNotification';

const encrypted = ref([]);
const BASE_URL = 'api/';

const generate = async () => {
  try {
    encrypted.value = [];

    const responsePresensi = await api.get(`${BASE_URL}presensi`);
    const presensiArray = responsePresensi.data;
    if (!Array.isArray(presensiArray) || presensiArray.length === 0) {
      console.warn("Data presensi kosong!");
      return;
    }

    const encryptedResults = await Promise.all(
      presensiArray.map(async (element) => {
        const responseEncrypt = await api.post(`${BASE_URL}crypto/encrypt`, { data: String(element.id_presensi) });
        encrypted.value.push(responseEncrypt.data)
        return responseEncrypt.data.data; 
      })
    );
    encrypted.value = encryptedResults;
  } catch (error) {
    showNotification('error', 'error: ' + (error.response?.data?.message || error.message))
  }
};
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
