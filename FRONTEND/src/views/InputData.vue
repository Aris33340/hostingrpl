<template>
  <div class="upload-container">
    <h2>Upload Data Mahasiswa (Excel)</h2>

    <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />

    <div v-if="preview.length">
      <h3>Preview Data ({{ preview.length }} baris)</h3>
      <table>
        <thead>
          <tr>
            <th v-for="(key, index) in Object.keys(preview[0])" :key="index">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in preview.slice(0, 5)" :key="index">
            <td v-for="(value, i) in Object.values(row)" :key="i">{{ value }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="preview.length > 5">Menampilkan 5 baris pertama...</p>

      <button @click="uploadData" :disabled="loading">
        {{ loading ? 'Mengirim...' : 'Kirim ke Server' }}
      </button>
    </div>

    <p v-if="message" style="color: green">{{ message }}</p>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx'
import axios from 'axios'
import { ref } from 'vue'
import {mainApi} from '@/api'
import { showNotification } from '../composables/useNotification'

const preview = ref([])
const message = ref('')
const loading = ref(false)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(firstSheet)
    preview.value = jsonData
  }
  reader.readAsArrayBuffer(file)
}

async function uploadData() {
  if (preview.value.length === 0) {
    message.value = 'Tidak ada data untuk dikirim.'
    showNotification('error',message.value);
    return
  }

  loading.value = true
  try {
    const response = await mainApi.post('/mahasiswa/bulk', preview.value)
    message.value = ` Berhasil menambahkan ${response.data.count} mahasiswa!`;
    showNotification('success',message.value);
  } catch (error) {
    showNotification('error',error.message);
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 40px auto;
  text-align: center;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}

td, th {
  border: 1px solid #ddd;
  padding: 6px;
}
</style>

