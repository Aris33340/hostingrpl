<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

      <!-- Modal content -->
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">
          {{ isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa' }}
        </h3>

        <!-- Error message -->
        <div v-if="errorMsg" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="simpan" class="space-y-3">
          <!-- NIM -->
          <div>
            <label class="text-sm text-gray-700 block mb-1">NIM *</label>
            <input
              v-model="form.nim"
              :disabled="isEdit"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Masukkan NIM"
              required
            />
          </div>

          <!-- Nama -->
          <div>
            <label class="text-sm text-gray-700 block mb-1">Nama *</label>
            <input
              v-model="form.nama"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <!-- Prodi & Kelas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-gray-700 block mb-1">Prodi</label>
              <input
                v-model="form.prodi"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Program studi"
              />
            </div>
            <div>
              <label class="text-sm text-gray-700 block mb-1">Kelas</label>
              <input
                v-model="form.kelas"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kelas"
              />
            </div>
          </div>

          <!-- Lainnya (opsional) -->
          <details class="mt-2">
            <summary class="text-sm text-gray-700 cursor-pointer">Lainnya (opsional)</summary>
            <div class="mt-2 space-y-2">
              <input
                v-model="form.no_telp"
                type="text"
                placeholder="No. Telp"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="form.daerah_penempatan"
                type="text"
                placeholder="Penempatan"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="form.judul_skripsi"
                type="text"
                placeholder="Judul Skripsi"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="form.dosen_pembimbing"
                type="text"
                placeholder="Dosen Pembimbing"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="form.daerah_asal"
                type="text"
                placeholder="Daerah Asal"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </details>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 mt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
            >
              <span v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isEdit ? 'Simpan' : 'Tambah' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api'

const props = defineProps({
  show: Boolean,
  mahasiswa: Object,
  isEdit: Boolean
})
const emit = defineEmits(['close', 'refresh'])

const form = ref({
  nim: '',
  nama: '',
  prodi: '',
  kelas: '',
  no_telp: '',
  daerah_penempatan: '',
  judul_skripsi: '',
  dosen_pembimbing: '',
  daerah_asal: ''
})

const errorMsg = ref('')
const isLoading = ref(false)

// Watch untuk edit mode
watch(() => props.mahasiswa, (val) => {
  if (val) {
    form.value = {
      nim: val.nim || '',
      nama: val.nama || '',
      prodi: val.prodi || '',
      kelas: val.kelas || '',
      no_telp: val.no_telp || '',
      daerah_penempatan: val.daerah_penempatan || '',
      judul_skripsi: val.judul_skripsi || '',
      dosen_pembimbing: val.dosen_pembimbing || '',
      daerah_asal: val.daerah_asal || ''
    }
  } else {
    form.value = {
      nim: '',
      nama: '',
      prodi: '',
      kelas: '',
      no_telp: '',
      daerah_penempatan: '',
      judul_skripsi: '',
      dosen_pembimbing: '',
      daerah_asal: ''
    }
  }
  errorMsg.value = ''
}, { immediate: true })

async function simpan() {
  errorMsg.value = ''
  isLoading.value = true

  try {
    // Validasi NIM
    if (!props.isEdit && !form.value.nim) {
      errorMsg.value = 'NIM harus diisi'
      return
    }

    // Validasi Nama
    if (!form.value.nama) {
      errorMsg.value = 'Nama harus diisi'
      return
    }

    if (props.isEdit) {
      // Update mahasiswa
      await api.put(`/api/mahasiswa/${form.value.nim}`, form.value)
    } else {
      // Tambah mahasiswa baru
      await api.post('/api/mahasiswa', form.value)
    }

    emit('refresh')
    emit('close')
  } catch (err) {
    console.error('Error saat menyimpan:', err)
    
    // Tampilkan pesan error yang lebih informatif
    if (err.response?.data?.message) {
      errorMsg.value = err.response.data.message
    } else if (err.message) {
      errorMsg.value = err.message
    } else {
      errorMsg.value = 'Terjadi error saat menyimpan data'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.18s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>