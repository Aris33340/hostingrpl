<template>
  <div>
    <h2 class="text-lg font-semibold mb-3 text-blue-100">📤 Upload Data Mahasiswa (Excel)</h2>

    <div class="flex items-center gap-3">
      <label class="flex-1 cursor-pointer">
        <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" class="hidden" ref="fileInput" />
        <div class="px-4 py-2 rounded-lg bg-white/6 border border-blue-500/10 hover:bg-white/10 transition flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <span class="text-sm text-blue-100">{{ fileName || 'Pilih file .xlsx / .xls' }}</span>
        </div>
      </label>

      <button
        @click="batalUpload"
        class="px-4 py-2 rounded-lg text-sm font-medium text-blue-50 bg-white/15 border border-blue-400/30 hover:bg-white/25 hover:text-white active:bg-white/30 active:scale-[0.98] transition-all duration-200 shadow-sm"
      >
        Batal
      </button>


      <button
        @click="uploadData"
        :disabled="!preview.length || loading"
        class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium disabled:opacity-50"
      >
        {{ loading ? 'Mengirim...' : 'Kirim Semua' }}
      </button>
    </div>

    <div v-if="preview.length" class="mt-4">
      <h3 class="text-sm text-blue-200 mb-2">Preview ({{ preview.length }} baris) — menampilkan 5 pertama</h3>

      <div class="overflow-x-auto bg-white/6 border border-blue-500/10 rounded-lg">
        <table class="w-full text-sm">
          <thead class="bg-white/8 text-white/90">
            <tr>
              <th v-for="(k, i) in headerKeys" :key="i" class="px-3 py-2 border-b text-left">{{ k }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in preview.slice(0,5)" :key="idx" class="hover:bg-white/10">
              <td v-for="(v, j) in Object.values(row)" :key="j" class="px-3 py-2 border-b">{{ v }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="preview.length > 5" class="text-xs text-blue-200/70 mt-2">Menampilkan 5 baris pertama...</p>
    </div>

  </div>
</template>

<script setup>
import * as XLSX from 'xlsx'
import { ref, computed, defineEmits } from 'vue'
import { mainApi } from '@/api'
import { showNotification } from '@/composables/useNotification'

const preview = ref([])
const loading = ref(false)
const fileName = ref('')
const fileInput = ref(null)
const emit = defineEmits(['refresh', 'loading'])

/* MAP NAMA KOLOM EXCEL → KOLOM DB */
const columnMap = {
  "NIM": "nim",
  "Nama": "nama",
  "Prodi": "prodi",
  "Kelas": "kelas",
  "No. Telp": "no_telp",
  "Daerah Asal": "daerah_asal",
  "Penempatan": "daerah_penempatan",
  "Judul Skripsi": "judul_skripsi",
  "Pembimbing": "dosen_pembimbing",
  "Orang Tua": "nama_orang_tua",
}

/* KOLOM WAJIB */
const requiredColumns = ["nim", "nama", "prodi", "kelas"]

const headerKeys = computed(() =>
  preview.value.length ? Object.keys(preview.value[0]) : []
)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  fileName.value = file.name

  preview.value = []

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(firstSheet)

      if (!rows.length) {
        showNotification('error', 'File kosong.')
        return
      }

      // MAPPING KOLOM
      const mapped = rows.map(row => {
        const newRow = {}

        Object.keys(row).forEach(key => {
          const cleanKey = key.trim()
          if (columnMap[cleanKey]) {
            newRow[columnMap[cleanKey]] = row[key]
          }
        })

        return newRow
      })

      // VALIDASI KOLOM WAJIB
      const firstRow = mapped[0]

      for (const col of requiredColumns) {
        if (!firstRow[col]) {
          showNotification('error', `Kolom wajib (${requiredColumns.join(', ')}) tidak ditemukan.`)
          batalUpload()
          return
        }
      }

      preview.value = mapped

    } catch (error) {
      console.error(error)
      showNotification('error', 'Gagal membaca file Excel.')
      batalUpload()
    }
  }

  reader.readAsArrayBuffer(file)
}

async function uploadData() {
  if (!preview.value.length) {
    showNotification('error', 'Tidak ada data untuk dikirim.')
    return
  }

  loading.value = true
  emit('loading', true)

  try {
    const res = await mainApi.post('/mahasiswa/bulk', preview.value)
    const count = res.data.count || preview.value.length

    showNotification('success', `Berhasil menambahkan ${count} mahasiswa.`)

    preview.value = []
    fileName.value = ''
    emit('refresh')

  } catch (err) {
    console.error(err)
    showNotification('error', err.response?.data?.message || 'Gagal upload data.')
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

function batalUpload() {
  preview.value = []
  fileName.value = ''
  if (fileInput.value) fileInput.value.value = null
}
</script>

