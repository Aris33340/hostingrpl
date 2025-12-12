<template>
  <div class="min-h-screen bg-gradient-to-br ">
    <!-- Header -->

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left Column - Settings Form -->
        <div class="lg:col-span-1">
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 sticky top-24">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
              Konfigurasi Sistem
            </h2>

            <div class="space-y-5">
              <!-- Mail User -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Email User</label>
                <input v-model="mailUser" type="email" placeholder="mail@example.com"
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200">
              </div>

              <!-- Mail Password -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Password Email</label>
                <input v-model="mailPass" type="text" placeholder="••••••••"
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200">
              </div>

              <!-- Hash Key -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Hash Key</label>
                <input v-model="hashKey" type="text" placeholder="Masukkan hash key"
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200">
              </div>

              <!-- Save Button -->
              <button @click="handleSetSettings"
                class="w-full mt-8 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-blue-500/20">
                Simpan Perubahan
              </button>
              <button @click="handleResetPresensi"
                class="w-full mt-8 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-blue-500/20">
                Reset Presensi
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column - User Management -->
        <div class="lg:col-span-2">
          <!-- User Table -->
          <div class="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 overflow-hidden">
            <div class="absolute top-0 inset-x-0 bg-white/5 border-b border-white/10 px-8 py-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-3">
                <span class="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                Manajemen Pengguna
              </h2>
            </div>

            <div class="p-6 mt-10">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-white/10">
                      <th class="text-center py-3 px-4 text-sm font-semibold text-slate-300">Username</th>
                      <th class="text-center py-3 px-4 text-sm font-semibold text-slate-300">Email</th>
                      <th class="text-center py-3 px-4 text-sm font-semibold text-slate-300">Role</th>
                      <th class="text-center py-3 px-4 text-sm font-semibold text-slate-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="data in users" :key="data.id_user"
                      class="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td class="py-4 px-4 text-white font-medium">{{ data.username }}</td>
                      <td class="py-4 px-4 text-slate-400 text-sm">{{ data.email }}</td>
                      <td class="py-4 px-4">
                        <span
                          class="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">
                          {{ data.role }}
                        </span>
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex gap-2 justify-center">
                          <button @click="openEdit(data)"
                            class="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold rounded-lg transition-colors duration-200">
                            Edit
                          </button>
                          <button @click="confirmDelete(data.id_user)"
                            class="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-semibold rounded-lg transition-colors duration-200">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span class="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></span>
              Import Data Pengguna
            </h2>

            <div class="space-y-4">
              <!-- File Input -->
              <div
                class="border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer"
                @click="$refs.fileInput.click()" :class="selectedFile ? 'bg-blue-500/10' : ''">
                <input ref="fileInput" type="file" @change="handleFileChange" accept=".xlsx" class="hidden">
                <div class="text-center">
                  <div class="text-3xl mb-2">📄</div>
                  <p class="text-white font-medium">{{ selectedFile ? selectedFile.name : 'Klik untuk pilih file' }}</p>
                  <p class="text-slate-400 text-sm mt-1">Format: .xlsx</p>
                </div>
              </div>

              <!-- Buttons -->
              <div class="grid grid-cols-2 gap-4">
                <button @click="getTemplate"
                  class="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200">
                  Unduh Template
                </button>
                <button @click="uploadFile" :disabled="!selectedFile || loading"
                  class="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200">
                  {{ loading ? 'Mengupload...' : 'Upload Data' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class=" border border-white/10 rounded-2xl w-11/12 max-w-md p-8 shadow-2xl">
        <h3 class="text-2xl font-bold text-white mb-6">Edit User</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input v-model="editForm.username" type="text"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input v-model="editForm.email" type="email"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select v-model="editForm.role"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:text-black  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200">
              <option value="SUPERADMIN">SUPERADMIN</option>
              <option value="PETUGAS">PETUGAS</option>
              <option value="SEKRETARIAT">SEKRETARIAT</option>
              <option value="BUKUWISUDA">BUKUWISUDA</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input v-model="editForm.password" type="text" placeholder="Kosongkan jika tidak ingin diubah"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200">
          </div>
        </div>

        <div class="flex gap-3 justify-end mt-8">
          <button @click="closeEdit"
            class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200">
            Batal
          </button>
          <button @click="updateUser" :disabled="updating"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200">
            {{ updating ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mainApi } from '../api';
import { onMounted, ref } from 'vue';
import { useLoading } from '../composables/useLoading';
import { notification, showNotification } from '../composables/useNotification';

const users = ref([]);
const selectedFile = ref(null);
const loading = ref(false);
const hashKey = ref('');
const mailUser = ref('');
const mailPass = ref('');
const { show, hide } = useLoading()
const showEditModal = ref(false);
const editForm = ref({
  id_user: null,
  username: '',
  email: '',
  role: '',
  password: ''
});
const updating = ref(false);

const handleSetSettings = async () => {
  try {
    await mainApi.post('settings', { key: 'HASH_KEY', value: hashKey.value }, { withCredentials: true });
    await mainApi.post('settings', { key: 'MAIL_USER', value: mailUser.value }, { withCredentials: true });
    await mainApi.post('settings', { key: 'MAIL_PASS', value: mailPass.value }, { withCredentials: true });
    alert("Settings berhasil disimpan!");
  } catch (err) {
    showNotification('error','gagal menyimpan perubahan')
  }
}
import Swal from "sweetalert2";

async function showConfirm() {
  return Swal.fire({
    title: "Anda yakin mereset status presensi?",
    text: `semua status akan menjadi tidak hadir`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Konfirmasi",
    cancelButtonText: "Batal"
  }).then((result) => {
    return result.isConfirmed;
  });
}

const handleResetPresensi = async () => {
  try {
    if (await showConfirm()) {
      show('Mereset Data Presensi...')
      mainApi.patch('presensi/unMark-status-all').then(showNotification('success', 'Semua peserta di set tidak hadir'))
    }
  } catch (error) {
    showNotification('error', error.message)
  } finally {
    hide()
  }
}

const loadSettings = async () => {
  show()
  try {
    const res = await mainApi.get('settings');
    res.data.forEach(setting => {
      if (setting.key === 'HASH_KEY') hashKey.value = setting.value;
      if (setting.key === 'MAIL_USER') mailUser.value = setting.value;
      if (setting.key === 'MAIL_PASS') mailPass.value = setting.value;
    });
  } catch (error) {
    showNotification('error', error.message)
  } finally {
    hide()
  }
}

const getUserData = async () => {
  show('Mencari Data User')
  try {
    const res = await mainApi.get('users', { withCredentials: true });
    users.value = res.data.filter(e => e.role !== 'SUPERADMIN');
  } catch (err) {
    showNotification('error', err.message)
  } finally {
    hide()
  }
}

const openEdit = (user) => {
  editForm.value = {
    id_user: user.id_user,
    username: user.username,
    email: user.email,
    role: user.role,
    password: ''
  };
  showEditModal.value = true;
}

const closeEdit = () => {
  showEditModal.value = false;
  editForm.value = { id_user: null, username: '', email: '', role: '', password: '' };
}

const updateUser = async () => {
  if (!editForm.value.id_user) return;
  updating.value = true;
  show()
  try {
    const payload = {
      username: editForm.value.username,
      email: editForm.value.email,
      role: editForm.value.role
    };
    if (editForm.value.password && editForm.value.password.trim() !== '') {
      payload['password'] = editForm.value.password;
    }

    const res = await mainApi.put(`users/${editForm.value.id_user}`, payload, { withCredentials: true });
    alert('User berhasil diupdate');
    await getUserData();
    closeEdit();
  } catch (err) {
    const msg = err?.response?.data?.message ?? 'Gagal update user';
    showNotification('error', msg)
  } finally {
    updating.value = false;
    hide()
  }
}

const confirmDelete = async (id) => {
  show()
  if (!confirm('Hapus user ini? Aksi ini tidak dapat dibatalkan.')) return;
  try {
    await mainApi.delete(`users/${id}`, { withCredentials: true });
    alert('User berhasil dihapus');
    await getUserData();
  } catch (err) {
    const msg = err?.response?.data?.message ?? 'Gagal menghapus user';
    showNotification('error', msg)
  } finally {
    hide()
  }
}

const getTemplate = async () => {
  try {
    const response = await mainApi.get('users/template', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UserWisudaTemplate.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    showNotification('error','Gagal download template. Silakan coba lagi.')
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) selectedFile.value = files[0];
};

const uploadFile = async () => {
  if (!selectedFile.value) return;
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    const response = await mainApi.post('/users/register/batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert(response.data.message || 'Upload berhasil');
    selectedFile.value = null;
    await getUserData();
  } catch (err) {
    showNotification('error', err.message)
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getUserData();
  await loadSettings();
});
</script>