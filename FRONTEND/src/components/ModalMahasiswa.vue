<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">{{ isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa' }}</h3>

        <form @submit.prevent="simpan" class="space-y-3">
          <div>
            <label class="text-sm text-gray-600 block mb-1">NIM</label>
            <input v-model="form.nim" :disabled="isEdit" class="w-full px-3 py-2 border rounded-md" required />
          </div>

          <div>
            <label class="text-sm text-gray-600 block mb-1">Nama</label>
            <input v-model="form.nama" class="w-full px-3 py-2 border rounded-md" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-gray-600 block mb-1">Prodi</label>
              <input v-model="form.prodi" class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="text-sm text-gray-600 block mb-1">Kelas</label>
              <input v-model="form.kelas" class="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <!-- Optional more fields collapsed (expandable) -->
          <details class="mt-2">
            <summary class="text-sm text-gray-600 cursor-pointer">Lainnya (opsional)</summary>
            <div class="mt-2 space-y-2">
              <input v-model="form.no_telp" placeholder="No. Telp" class="w-full px-3 py-2 border rounded-md" />
              <input v-model="form.penempatan" placeholder="Penempatan" class="w-full px-3 py-2 border rounded-md" />
              <input v-model="form.judul_skripsi" placeholder="Judul Skripsi" class="w-full px-3 py-2 border rounded-md" />
              <input v-model="form.dosen_pembimbing" placeholder="Dosen Pembimbing" class="w-full px-3 py-2 border rounded-md" />
            </div>
          </details>

          <div class="flex justify-end gap-3 mt-4">
            <button type="button" @click="$emit('close')" class="px-3 py-2 rounded-md bg-gray-200 text-gray-700">Batal</button>
            <button type="submit" class="px-4 py-2 rounded-md bg-blue-600 text-white">{{ isEdit ? 'Simpan' : 'Tambah' }}</button>
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
  isEdit: Boolean,
})
const emit = defineEmits(['close', 'refresh'])

const form = ref({
  nim: '',
  nama: '',
  prodi: '',
  kelas: '',
  no_telp: '',
  penempatan: '',
  judul_skripsi: '',
  dosen_pembimbing: '',
})

watch(
  () => props.mahasiswa,
  (val) => {
    if (val) form.value = { ...val }
    else form.value = { nim: '', nama: '', prodi: '', kelas: '', no_telp: '', penempatan: '', judul_skripsi: '', dosen_pembimbing: '' }
  },
  { immediate: true },
)

async function simpan() {
  try {
    if (props.isEdit) {
      await api.put(`/api/mahasiswa/${form.value.nim}`, form.value)
    } else {
      await api.post('/api/mahasiswa', form.value)
    }
    emit('refresh')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('Terjadi error saat menyimpan.')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
