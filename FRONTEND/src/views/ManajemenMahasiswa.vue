<template>
  <div class="min-h-screen p-8 text-white">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <header class="mb-8 text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-white">
          📚 Manajemen Mahasiswa
        </h2>
        <p class="text-blue-200/70 mt-1 text-sm">Dashboard Admin • Kelola data mahasiswa</p>
      </header>

      <!-- Upload Section -->
      <section class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6 mb-8">
        <InputData @refresh="fetchMahasiswa" @loading="isUploading = $event" />
        <div v-if="isUploading" class="mt-4 flex items-center gap-2 text-sm text-blue-100/80">
          <span class="w-4 h-4 border-2 border-blue-300/40 border-t-blue-500 rounded-full animate-spin"></span>
          <span>Sedang mengunggah data...</span>
        </div>
      </section>

      <!-- CRUD & Table Section -->
      <section class="bg-white/6 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 class="text-xl font-semibold text-white">Daftar Mahasiswa</h3>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <input v-model="search" @input="onSearch" type="text" placeholder="Cari mahasiswa..."
              class="w-full md:w-72 px-3 py-2 rounded-lg bg-white/10 border border-transparent placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button @click="tambahMahasiswa"
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-sm transition">
              + Tambah Mahasiswa
            </button>
          </div>
        </div>

        <div class="relative">
          <TableMahasiswa :mahasiswa="mahasiswa" @edit="editMahasiswa" @hapus="hapusMahasiswa" />

          <!-- Loading overlay -->
          <div v-if="isLoading"
            class="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
            <span class="w-5 h-5 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></span>
            <span class="text-xs text-blue-100">Memuat data...</span>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-blue-200/80">
            Menampilkan <span class="font-medium text-white">{{ mahasiswa.length }}</span> baris
          </div>
          <div class="flex items-center gap-2">
            <button @click="prevPage" :disabled="page === 1"
              class="px-3 py-1 rounded-lg text-gray-100 bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200 disabled:text-gray-400 disabled:bg-white/5">
              ‹ Prev
            </button>
            <span class="text-sm">Halaman <span class="font-medium">{{ page }}</span></span>
            <button @click="nextPage" :disabled="mahasiswa.length < limit"
              class="px-3 py-1 rounded-lg text-gray-100 bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200 disabled:text-gray-400 disabled:bg-white/5">
              Next ›
            </button>
          </div>
        </div>
      </section>
      <ModalMahasiswa :show="showModal" :mahasiswa="selectedMahasiswa" :isEdit="isEdit" @close="showModal = false"
        @refresh="fetchMahasiswa" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mainApi } from '@/api'
import InputData from '@/components/InputData.vue'
import TableMahasiswa from '@/components/TableMahasiswa.vue'
import ModalMahasiswa from '@/components/ModalMahasiswa.vue'
import { showNotification } from '../composables/useNotification'

const mahasiswa = ref([])
const search = ref('')
const showModal = ref(false)
const selectedMahasiswa = ref(null)
const isEdit = ref(false)
const isLoading = ref(false)
const isUploading = ref(false)
const page = ref(1)
const limit = 10
let searchTimeout = null

// Fetch mahasiswa with optional search & pagination
async function fetchMahasiswa() {
  try {
    isLoading.value = true
    const { data } = await mainApi.get('mahasiswa/pagination', {
      params: {
        search: search.value || undefined,
        page: page.value,
        limit: limit
      }
    })

    mahasiswa.value = data.data || []
  } catch (err) {
    showNotification('error', err.message || 'Gagal memuat tabel');
    mahasiswa.value = []
  } finally {
    isLoading.value = false
  }
}

// CRUD Functions
function tambahMahasiswa() {
  selectedMahasiswa.value = null
  isEdit.value = false
  showModal.value = true
}

function editMahasiswa(m) {
  selectedMahasiswa.value = m
  isEdit.value = true
  showModal.value = true
}

async function hapusMahasiswa(nim) {
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await mainApi.delete(`mahasiswa/${nim}`)
    fetchMahasiswa()
  } catch (err) {
    showNotification('error', err.message || 'Gagal memuat tabel');
  }
}

// Pagination
function nextPage() {
  page.value++
  fetchMahasiswa()
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    fetchMahasiswa()
  }
}

// Debounce search
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchMahasiswa()
  }, 400)
}

// Initial load
onMounted(fetchMahasiswa)
</script>
