<template>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header Controls -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-700">Manajemen Responden</h1>
        <div class="flex gap-3">
          <input v-model="searchQuery" type="text"
            placeholder="Cari nama atau email..."
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <select v-model="filterStatus"
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400">
            <option value="">Semua Status</option>
            <option value="0">Belum Digunakan</option>
            <option value="1">Sudah Digunakan</option>
          </select>
          <button @click="openAddModal"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Tambah
          </button>
        </div>
      </div>
  
      <!-- Tabel Data -->
      <div class="overflow-x-auto bg-white shadow rounded-lg">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Nama</th>
              <th class="px-4 py-2 text-left">Email</th>
              <th class="px-4 py-2 text-left">Token</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Form</th>
              <th class="px-4 py-2 text-left">Landing</th>
              <th class="px-4 py-2 text-left">Aktif Sejak</th>
              <th class="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, index) in filteredResponden" :key="index"
                class="border-b hover:bg-gray-50">
              <td class="px-4 py-2">{{ value.id }}</td>
              <td class="px-4 py-2">{{ value.nama }}</td>
              <td class="px-4 py-2">{{ value.email }}</td>
              <td class="px-4 py-2 truncate max-w-[150px]">{{ value.tautan[0].token }}</td>
              <td class="px-4 py-2">
                <span
                  :class="value.tautan[0].isUsed ? 'text-green-600' : 'text-red-500'">
                  {{ value.tautan[0].isUsed ? 'Sudah Digunakan' : 'Belum Digunakan' }}
                </span>
              </td>
              <td class="px-4 py-2">{{ value.tautan[0].tautanForm }}</td>
              <td class="px-4 py-2">{{ value.tautan[0].tautanLandingPage }}</td>
              <td class="px-4 py-2">
                {{ value.tautan[0].activeAt ? formatDate(value.tautan[0].activeAt) : '-' }}
              </td>
              <td class="px-4 py-2 text-center">
                <div class="flex justify-center gap-2">
                  <button @click="openEditModal(value)"
                    class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                    Edit
                  </button>
                  <button @click="deleteResponden(value.id)"
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal Form -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Responden' : 'Tambah Responden' }}</h2>
          <div class="space-y-3">
            <input v-model="form.nama" placeholder="Nama" class="w-full border p-2 rounded" />
            <input v-model="form.email" placeholder="Email" class="w-full border p-2 rounded" />
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
            <button @click="submitForm" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import respondenApi from '../respondentApi'
  
  const responden = ref([])
  const searchQuery = ref('')
  const filterStatus = ref('')
  const showModal = ref(false)
  const isEditing = ref(false)
  const form = ref({ id: null, nama: '', email: '' })
  
  const loadData = async () => {
    responden.value = await respondenApi.getAll();
  }
  onMounted(loadData)
  
  const formatDate = (date) => new Date(date).toLocaleString('id-ID')
  
  const filteredResponden = computed(() =>
    responden.value.filter(r => {
      const matchSearch =
        r.nama?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchStatus = filterStatus.value === ''
        ? true
        : String(r.tautan[0].isUsed) === filterStatus.value
      return matchSearch && matchStatus
    })
  )
  
  const openAddModal = () => {
    isEditing.value = false
    form.value = { id: null, nama: '', email: '' }
    showModal.value = true
  }
  const openEditModal = (res) => {
    isEditing.value = true
    form.value = { ...res }
    showModal.value = true
  }
  const closeModal = () => showModal.value = false
  
  const submitForm = async () => {
    if (isEditing.value) await respondenApi.update(form.value.id, form.value)
    else await respondenApi.create(form.value)
    await loadData()
    closeModal()
  }
  const deleteResponden = async (id) => {
    if (confirm('Yakin ingin menghapus responden ini?')) {
      await respondenApi.remove(id)
      await loadData()
    }
  }
  </script>
  