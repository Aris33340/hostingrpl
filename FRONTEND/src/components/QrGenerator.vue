<template>
<button @click="generate" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button>
  <div v-if="mahasiswa">
    <qrcode-vue :value="value" :size="size" level="H" render-as="svg" />
    <qrcode-canvas :value="'QRCODE.VUE'" :size="size" level="H" />
    <qrcode-svg value="QRCODE.VUE" level="H" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QrcodeVue, { QrcodeCanvas, QrcodeSvg } from 'qrcode.vue'
import api from "@/api"

const mahasiswa = ref('');
const encrypted = ref([]);
const generate = async () => { 
    try {
    const response = await api.get("/api/mahasiswa");
    const res = response.data;
    mahasiswa.value = res;
  } catch (error) {
  console.log(error);
  }
  console.log(mahasiswa)
}
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
