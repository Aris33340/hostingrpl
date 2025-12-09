<template>
  <div class="relative w-full min-h-screen overflow-hidden text-white">

    <!-- <img src="@/assets/images/Background.png" class="fixed top-0 left-0 w-full h-full object-cover z-0"
      alt="Background" /> -->

    <div class="relative z-10 min-h-screen px-10 mx-8">
      <div class="relative mb-8">

        <img :src="WisudawanIcon"
          class="absolute left-0 top-0 z-10 w-40 h-auto object-contain transform -translate-x-12 -translate-y-4"
          alt="Wisudawan Icon" />

        <img :src="WisudawatiIcon"
          class="absolute right-0 top-0 z-10 w-40 h-auto object-contain transform translate-x-12 -translate-y-4"
          alt="Wisudawati Icon" />

        <!-- Button -->
        <div class="flex justify-center mb-4 gap-4 relative z-20">
          <button @click="changeView('mahasiswa')" :class="[tabClass(currentView === 'mahasiswa')]">
            🎓 Data Mahasiswa
          </button>
          <button @click="changeView('tamu')" :class="[tabClass(currentView === 'tamu')]">
            👤 Data Tamu
          </button>
        </div>

        <!-- Upload Excel -->
        <section v-if="currentView === 'mahasiswa'"
          class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
          <UploadExcelMahasiswa @refresh="fetchData" @loading="isUploading = $event" />
          <div v-if="isUploading" class="mt-4 flex items-center gap-2 text-sm text-blue-100/80">
            <span class="w-4 h-4 border-2 border-blue-300/40 border-t-blue-500 rounded-full animate-spin"></span>
            <span>Sedang mengunggah data...</span>
          </div>
        </section>

        <section v-if="currentView === 'tamu'"
          class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
          <UploadExcelTamu @refresh="fetchData" @loading="isUploading = $event" />
          <div v-if="isUploading" class="mt-4 flex items-center gap-2 text-sm text-blue-100/80">
            <span class="w-4 h-4 border-2 border-blue-300/40 border-t-blue-500 rounded-full animate-spin"></span>
            <span>Sedang mengunggah data tamu...</span>
          </div>
        </section>
      </div>

      <!--
    NOTES: INI TUH KODE BERSIH yang TANPA ADA WISUDAWAN WISUDAWATI YAAA
    
TAB Switcher
<div class="flex justify-center mb-8 gap-4">
  <button
    @click="changeView('mahasiswa')"
    :class="[tabClass(currentView === 'mahasiswa')]">
    🎓 Data Mahasiswa
  </button>
  <button
    @click="changeView('tamu')"
    :class="[tabClass(currentView === 'tamu')]">
    👤 Data Tamu
  </button>
</div>

Upload Excel
<section 
    v-if="currentView === 'mahasiswa'" 
    class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
    <UploadExcelMahasiswa @refresh="fetchData" @loading="isUploading = $event" />
    <div v-if="isUploading" class="mt-4 flex items-center gap-2 text-sm text-blue-100/80">
        <span class="w-4 h-4 border-2 border-blue-300/40 border-t-blue-500 rounded-full animate-spin"></span>
        <span>Sedang mengunggah data...</span>
    </div>
</section>

<section v-if="currentView === 'tamu'" class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
    <UploadExcelTamu @refresh="fetchData" @loading="isUploading = $event" />
    <div v-if="isUploading" class="mt-4 flex items-center gap-2 text-sm text-blue-100/80">
        <span class="w-4 h-4 border-2 border-blue-300/40 border-t-blue-500 rounded-full animate-spin"></span>
        <span>Sedang mengunggah data tamu...</span>
    </div>
</section>
-->


      <!-- CRUD & Table Section -->
      <section class="bg-white/6 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 class="text-xl font-semibold text-white">Daftar {{ currentView === 'mahasiswa' ? 'Mahasiswa' : 'Tamu' }}
          </h3>

          <div class="flex items-center gap-3 w-full md:w-auto">

            <!-- FILTER -->
            <select v-if="currentView === 'mahasiswa'" v-model="filterMahasiswa" @change="applyFilter"
              class="px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400">

              <option value="">Semua Kelas / Prodi</option>
              <option v-for="item in listFilterMahasiswa" :key="item" :value="item">
                {{ item }}
              </option>
            </select>

            <select v-if="currentView === 'tamu'" v-model="filterInstansi" @change="applyFilter"
              class="px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400">

              <option value="">Semua Instansi</option>
              <option v-for="item in listInstansi" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
            <!-- END FILTER -->

            <input v-model="search" @input="onSearch" type="text"
              :placeholder="'Cari ' + (currentView === 'mahasiswa' ? 'Mahasiswa (NIM, Nama, Prodi...)' : 'Tamu (Nama, Email, Instansi...)')"
              class="w-full md:w-72 px-3 py-2 rounded-lg bg-white/10 border border-transparent placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button @click="tambahPeserta"
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-sm transition">
              + Tambah {{ currentView === 'mahasiswa' ? 'Mahasiswa' : 'Tamu' }}
            </button>
          </div>
        </div>

        <div class="relative min-h-96">
          <!-- Tampilan Mahasiswa -->
          <TableMahasiswa v-if="currentView === 'mahasiswa'" :mahasiswa="dataList" @edit="editPeserta"
            @hapus="hapusPeserta" />

          <!-- Tampilan Tamu -->
          <TableTamu v-else-if="currentView === 'tamu'" :tamu="dataList" @edit="editPeserta" @hapus="hapusPeserta" />

          <!-- Loading overlay -->
          <div v-if="isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
            <span class="w-8 h-8 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin mb-3"></span>
            <span class="text-sm text-blue-100">Memuat data {{ currentView }}...</span>
          </div>

          <div v-if="!isLoading && dataList.length === 0" class="text-center py-12 text-blue-200/80">
            Tidak ada data {{ currentView }} ditemukan.
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-blue-200/80">
            Menampilkan <span class="font-medium text-white">{{ dataList.length }}</span> baris
          </div>
          <div class="flex items-center gap-2">
            <button @click="prevPage" :disabled="page === 1"
              class="px-3 py-1 rounded-lg text-gray-100 bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200 disabled:text-gray-400 disabled:bg-white/5">
              ‹ Prev
            </button>
            <span class="text-sm">Halaman <span class="font-medium">{{ page }}</span></span>
            <button @click="nextPage" :disabled="dataList.length < limit"
              class="px-3 py-1 rounded-lg text-gray-100 bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200 disabled:text-gray-400 disabled:bg-white/5">
              Next ›
            </button>
          </div>
        </div>

        <!-- Modals -->
        <ModalMahasiswa v-if="currentView === 'mahasiswa'" :show="showModal" :mahasiswa="selectedPeserta"
          :isEdit="isEdit" @close="showModal = false" @refresh="fetchData" />
        <ModalTamu v-if="currentView === 'tamu'" :show="showModal" :tamu="selectedPeserta" :isEdit="isEdit"
          @close="showModal = false" @refresh="fetchData" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mainApi } from '@/api'
import UploadExcelMahasiswa from '@/components/UploadExcelMahasiswa.vue'
import UploadExcelTamu from '@/components/UploadExcelTamu.vue'
import TableMahasiswa from '@/components/TableMahasiswa.vue'
import ModalMahasiswa from '@/components/ModalMahasiswa.vue'
import TableTamu from '@/components/TableTamu.vue'
import ModalTamu from '@/components/ModalTamu.vue'
import { showNotification } from '@/composables/useNotification'

import WisudawanIcon from '@/assets/images/wisudawan.png'
import WisudawatiIcon from '@/assets/images/wisudawati.png'

const currentView = ref('mahasiswa')
const dataList = ref([])

const search = ref('')

const showModal = ref(false)
const selectedPeserta = ref(null)
const isEdit = ref(false)
const isLoading = ref(false)
const isUploading = ref(false)

const page = ref(1)
const limit = 10
let searchTimeout = null

// FILTER
const filterMahasiswa = ref('')
const filterInstansi = ref('')
const listFilterMahasiswa = ref([])
const listInstansi = ref([])

async function loadFilters() {
  try {
    if (currentView.value === 'mahasiswa') {
      const kelasRes = await mainApi.get('mahasiswa/field/kelas')
      const prodiRes = await mainApi.get('mahasiswa/field/prodi')

      const kelas = kelasRes.data.map(i => i.kelas)
      const prodi = prodiRes.data.map(i => i.prodi)

      listFilterMahasiswa.value = [...kelas, ...prodi]

    } else {
      const instansiRes = await mainApi.get('tamu/field/instansi')
      listInstansi.value = instansiRes.data.map(i => i.asal_instansi)
    }
  } catch (err) {
    showNotification('error', 'Gagal memuat filter.')
  }
}


// Utility untuk kelas tab
function tabClass(active) {
  return [
    'px-6 py-2 rounded-full font-bold transition-all',
    active
      ? 'bg-blue-600 shadow-lg shadow-blue-500/50 text-white'
      : 'bg-white/10 hover:bg-white/20 text-blue-200'
  ]
}

// Fetch data Mahasiswa/Tamu
async function fetchData() {
  try {
    isLoading.value = true
    const token = localStorage.getItem('token') || ''; // Ambil token dari Local Storage

    const endpoint = currentView.value === 'mahasiswa'
      ? 'mahasiswa/pagination'
      : 'tamu/pagination'

    const { data } = await mainApi.get(endpoint, {
      params: {
        search: search.value || undefined,
        page: page.value,
        limit: limit,
        filter: currentView.value === 'mahasiswa' ? filterMahasiswa.value : undefined,
        instansi: currentView.value === 'tamu' ? filterInstansi.value : undefined
      },
      // AKTIFKAN DAN PERBAIKI HEADER UNTUK MENGIRIM TOKEN
      headers: { Authorization: `Bearer ${token}` }
    })

    dataList.value = data.data || []
  } catch (err) {
    // Tambahkan penanganan khusus untuk 401
    if (err.response?.status === 401) {
      showNotification('error', 'Sesi berakhir atau tidak terautentikasi. Silakan login ulang.');
    } else {
      showNotification('error', err.response?.data?.message || `Gagal memuat data ${currentView.value}`);
    }
    dataList.value = []
  } finally {
    isLoading.value = false
  }
}

function applyFilter() {
  page.value = 1
  fetchData()
}

// Ganti tab
const changeView = (view) => {
  if (currentView.value !== view) {
    currentView.value = view
    search.value = ''
    filterMahasiswa.value = ''
    filterInstansi.value = ''
    page.value = 1
    loadFilters()
    fetchData()
  }
}

function refreshAll() {
  loadFilters()
  fetchData()
}

// CRUD
function tambahPeserta() {
  selectedPeserta.value = null
  isEdit.value = false
  showModal.value = true
}

function editPeserta(item) {
  selectedPeserta.value = { ...item }
  isEdit.value = true
  showModal.value = true
}

async function hapusPeserta(item) {
  const entityName = currentView.value === 'mahasiswa' ? 'Mahasiswa' : 'Tamu'
  const endpoint = currentView.value === 'mahasiswa' ? 'mahasiswa' : 'tamu'
  const id = currentView.value === 'mahasiswa' ? item.nim : item.id_tamu
  const token = localStorage.getItem('token') || ''; // Ambil token

  if (!confirm(`Yakin ingin menghapus data ${entityName} ini?`)) return
  try {
    // Tambahkan header Authorization saat delete
    await mainApi.delete(`${endpoint}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    showNotification('success', `${entityName} berhasil dihapus.`)
    fetchData()
  } catch (err) {
    showNotification('error', err.response?.data?.message || `Gagal menghapus data ${entityName}`)
  }
}

// Pagination
function nextPage() { page.value++; fetchData() }
function prevPage() { if (page.value > 1) { page.value--; fetchData() } }

// Debounce search
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; fetchData() }, 400)
}

onMounted(() => {
  loadFilters()
  fetchData()
})
</script>

<style scoped>
.bg-blue-600 {
  background-color: #2563eb;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.5), 0 4px 6px -2 rgba(37, 99, 235, 0.05);
}

select option {
  color: black;
  background-color: white;
  /* Opsional: Memastikan latar belakang option putih */
}
</style>