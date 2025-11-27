<template>
  <div class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
        Filter Data Mahasiswa
      </h3>
      <button 
        @click="toggleFilter" 
        class="text-sm text-blue-200 hover:text-white transition flex items-center gap-1"
      >
        <span>{{ isExpanded ? 'Sembunyikan' : 'Tampilkan' }} Filter</span>
        <svg :class="{'rotate-180': isExpanded}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>

    <transition name="slide-fade">
      <div v-if="isExpanded" class="space-y-4">
        <!-- Filter Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Filter Kelas -->
          <div>
            <label class="text-sm text-blue-200 block mb-1.5">Kelas</label>
            <select 
              v-model="localFilters.kelas"
              @change="applyFilter"
              class="w-full px-3 py-2 rounded-lg bg-white/10 border border-blue-500/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="" class="bg-gray-800">Semua Kelas</option>
              <option v-for="k in options.kelas" :key="k" :value="k" class="bg-gray-800">{{ k }}</option>
            </select>
          </div>

          <!-- Filter Prodi -->
          <div>
            <label class="text-sm text-blue-200 block mb-1.5">Program Studi</label>
            <select 
              v-model="localFilters.prodi"
              @change="applyFilter"
              class="w-full px-3 py-2 rounded-lg bg-white/10 border border-blue-500/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="" class="bg-gray-800">Semua Prodi</option>
              <option v-for="p in options.prodi" :key="p" :value="p" class="bg-gray-800">{{ p }}</option>
            </select>
          </div>

          <!-- Filter Dosen Pembimbing -->
          <div>
            <label class="text-sm text-blue-200 block mb-1.5">Dosen Pembimbing</label>
            <select 
              v-model="localFilters.dosen_pembimbing"
              @change="applyFilter"
              class="w-full px-3 py-2 rounded-lg bg-white/10 border border-blue-500/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="" class="bg-gray-800">Semua Dosen</option>
              <option v-for="d in options.dosen_pembimbing" :key="d" :value="d" class="bg-gray-800">{{ d }}</option>
            </select>
          </div>

          <!-- Filter Daerah Asal -->
          <div>
            <label class="text-sm text-blue-200 block mb-1.5">Daerah Asal</label>
            <select 
              v-model="localFilters.daerah_asal"
              @change="applyFilter"
              class="w-full px-3 py-2 rounded-lg bg-white/10 border border-blue-500/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="" class="bg-gray-800">Semua Daerah Asal</option>
              <option v-for="da in options.daerah_asal" :key="da" :value="da" class="bg-gray-800">{{ da }}</option>
            </select>
          </div>

          <!-- Filter Daerah Penempatan -->
          <div>
            <label class="text-sm text-blue-200 block mb-1.5">Daerah Penempatan</label>
            <select 
              v-model="localFilters.daerah_penempatan"
              @change="applyFilter"
              class="w-full px-3 py-2 rounded-lg bg-white/10 border border-blue-500/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="" class="bg-gray-800">Semua Daerah Penempatan</option>
              <option v-for="dp in options.daerah_penempatan" :key="dp" :value="dp" class="bg-gray-800">{{ dp }}</option>
            </select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-2 border-t border-white/10">
          <div class="text-sm text-blue-200/70">
            {{ activeFilterCount > 0 ? `${activeFilterCount} filter aktif` : 'Tidak ada filter aktif' }}
          </div>
          <div class="flex gap-2">
            <button 
              @click="resetFilters"
              :disabled="activeFilterCount === 0"
              class="px-4 py-2 rounded-lg text-sm font-medium text-blue-100 bg-white/10 border border-blue-400/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Reset Filter
            </button>
            <button 
              @click="applyFilter"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { mainApi } from '@/api'

const emit = defineEmits(['filter-change'])

const isExpanded = ref(false)
const options = ref({
  kelas: [],
  prodi: [],
  dosen_pembimbing: [],
  daerah_asal: [],
  daerah_penempatan: []
})

const localFilters = ref({
  kelas: '',
  prodi: '',
  dosen_pembimbing: '',
  daerah_asal: '',
  daerah_penempatan: ''
})

// Hitung jumlah filter yang aktif
const activeFilterCount = computed(() => {
  return Object.values(localFilters.value).filter(v => v !== '').length
})

// Toggle expand/collapse
function toggleFilter() {
  isExpanded.value = !isExpanded.value
}

// Fetch filter options dari backend
async function fetchFilterOptions() {
  try {
    const { data } = await mainApi.get('mahasiswa/filter-options')
    options.value = data
  } catch (err) {
    console.error('Gagal memuat opsi filter:', err)
  }
}

// Apply filter
function applyFilter() {
  emit('filter-change', { ...localFilters.value })
}

// Reset semua filter
function resetFilters() {
  localFilters.value = {
    kelas: '',
    prodi: '',
    dosen_pembimbing: '',
    daerah_asal: '',
    daerah_penempatan: ''
  }
  applyFilter()
}

onMounted(() => {
  fetchFilterOptions()
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>