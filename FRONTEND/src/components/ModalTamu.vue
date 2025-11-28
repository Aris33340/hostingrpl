<template>
  <!-- Menggunakan CSS Modal Mahasiswa (tema terang) -->
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 top-0 z-50 flex items-center justify-center" @click.self="$emit('close')">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black/50"></div>
      
      <!-- Modal content -->
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10 transform transition-all duration-300 scale-95 opacity-0" :class="{'scale-100 opacity-100': show}">
        
        <!-- Header -->
        <h3 class="text-lg font-semibold mb-4 text-gray-900">
          {{ isEdit ? 'Edit Data Tamu' : 'Tambah Tamu Baru' }}
        </h3>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-3">
          
          <div class="mb-4">
            <label for="nama" class="block text-sm text-gray-700 mb-1">Nama Tamu *</label>
            <input type="text" id="nama" v-model="formData.nama" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap" />
          </div>

          <div class="mb-4">
            <label for="email" class="block text-sm text-gray-700 mb-1">Email *</label>
            <input type="email" id="email" v-model="formData.email" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan email" />
          </div>

          <div class="mb-6">
            <label for="asal_instansi" class="block text-sm text-gray-700 mb-1">Asal Instansi *</label>
            <input type="text" id="asal_instansi" v-model="formData.asal_instansi" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: PT ABC, Universitas X" />
          </div>
          
          <!-- Footer -->
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="$emit('close')"
              class="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
              Batal
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2">
              <span v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isEdit ? 'Simpan' : 'Tambah' }}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { mainApi } from '@/api'
import { showNotification } from '@/composables/useNotification'

const props = defineProps({
  show: Boolean,
  tamu: Object, // Data tamu saat ini (jika mode edit)
  isEdit: Boolean
})

const emit = defineEmits(['close', 'refresh'])

const initialForm = { nama: '', email: '', asal_instansi: '' }
const formData = ref({ ...initialForm })
const isSubmitting = ref(false)

// Watcher untuk mengisi form saat props.tamu berubah (mode edit)
watch(() => props.tamu, (newTamu) => {
  if (newTamu) {
    // Jika tamu ada, gunakan data yang ada, tapi pastikan tidak menimpa id
    formData.value = { 
        id: newTamu.id, // Pertahankan ID untuk PUT request
        nama: newTamu.nama || '', 
        email: newTamu.email || '', 
        asal_instansi: newTamu.asal_instansi || '' 
    }
  } else {
    formData.value = { ...initialForm }
  }
}, { immediate: true })

// Logika untuk mengirim data (CREATE atau UPDATE)
async function handleSubmit() {
  isSubmitting.value = true
  try {
    if (props.isEdit) {
      // Endpoint: PUT /tamu/:id
      // Gunakan formData.value.id yang sudah disalin saat watch
      await mainApi.put(`tamu/${formData.value.id}`, formData.value)
      showNotification('success', 'Data Tamu berhasil diperbarui!');
    } else {
      // Endpoint: POST /tamu
      // Pastikan payload hanya berisi field yang dibutuhkan untuk POST
      const postPayload = {
        nama: formData.value.nama,
        email: formData.value.email,
        asal_instansi: formData.value.asal_instansi,
      };
      await mainApi.post('tamu', postPayload)
      showNotification('success', 'Tamu baru berhasil ditambahkan!');
    }
    
    emit('refresh')
    emit('close')
  } catch (err) {
    // Menampilkan pesan error dari backend
    showNotification('error', err.response?.data?.message || 'Gagal menyimpan data.');
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>