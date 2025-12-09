<template>
    <div class="w-full h-full">
      <div class="w-full h-full flex flex-col lg:flex-row">
        <div class="w-full lg:w-1/2 h-full p-6 flex flex-col gap-2 text-white">
          <div class="w-full h-16 flex flex-col text-start">
            <label for="mailUser">MAIL USER</label>
            <input v-model="mailUser" name="maulUser"
              class="h-10 bg-white/50 border outline-none border-white rounded-lg p-2 transition-all duration-100 focus:border-blue-400 focus:border-4"
              type="email">
          </div>
          <div class="w-full h-16 flex flex-col text-start">
            <label for="mailPass">MAIL PASS</label>
            <input v-model="mailPass" name="mailPass"
              class="h-10 bg-white/50 border outline-none border-white rounded-lg p-2 transition-all duration-100 focus:border-blue-400 focus:border-4"
              type="text">
          </div>
          <div class="w-full h-16 flex flex-col text-start">
            <label for="hashKey">Hash Key</label>
            <input v-model="hashKey" name="hashkey"
              class="h-10 bg-white/50 border outline-none border-white rounded-lg p-2 transition-all duration-100 focus:border-blue-400 focus:border-4"
              type="text">
          </div>
          <div class="flex-1"></div>
          <div>
            <button @click="handleSetSettings"
              class="bg-blue-600 w-full h-12 rounded-lg text-white active:bg-blue-400 transition-colors duration-100">
              Simpan Perubahan
            </button>
          </div>
        </div>
  
        <div class="w-full lg:w-1/2 h-full p-6 flex flex-col gap-2 text-black bg-white">
          <div>
            <h2 class="font-bold text-3xl">User Account</h2>
          </div>
  
          <div class="flex flex-col h-full">
            <div class="overflow-y-scroll h-full">
              <table class="w-full">
                <thead>
                  <tr class="border-collapse border-b h-12 border-black">
                    <th>USERNAME</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="data in users" :key="data.id_user" class="border-collapse border-b h-12 border-black">
                    <td>{{ data.username }}</td>
                    <td>{{ data.email }}</td>
                    <td>{{ data.role }}</td>
                    <td>
                      <div class="flex flex-col gap-2 w-full justify-center">
                        <button @click="openEdit(data)" class="bg-yellow-400 text-white px-2 rounded-sm">edit</button>
                        <button @click="confirmDelete(data.id_user)" class="bg-red-600 text-white px-2 rounded-sm">delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <div class="flex-1"></div>
  
            <input type="file" @change="handleFileChange" accept=".xlsx">
            <div class="flex w-full flex-row gap-2">
              <button @click="getTemplate" class="bg-blue-600 w-1/5 h-12 text-white font-bold">Unduh Template</button>
              <button @click="uploadFile" class="bg-blue-600 w-4/5 h-12 text-white font-bold">Upload Data</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed text-black inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="bg-white p-6 rounded-lg w-11/12 max-w-lg">
          <h3 class="text-xl font-bold mb-4">Edit User</h3>
          <div class="mb-2">
            <label class="block text-sm">Username</label>
            <input v-model="editForm.username" class="w-full p-2 border rounded" type="text" />
          </div>
          <div class="mb-2">
            <label class="block text-sm">Email</label>
            <input v-model="editForm.email" class="w-full p-2 border rounded" type="email" />
          </div>
          <div class="mb-2">
            <label class="block text-sm">Role</label>
            <select v-model="editForm.role" class="w-full p-2 border rounded">
              <option value="SUPERADMIN">SUPERADMIN</option>
              <option value="PETUGAS">PETUGAS</option>
              <option value="SEKRETARIAT">SEKRETARIAT</option>
              <option value="BUKUWISUDA">BUKUWISUDA</option>
              <!-- sesuaikan role sesuai enum di backend -->
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm">Password (kosongkan bila tidak ingin diganti)</label>
            <input v-model="editForm.password" class="w-full p-2 border rounded" type="password" />
          </div>
  
          <div class="flex gap-2 justify-end">
            <button @click="closeEdit" class="px-4 py-2 border rounded">Batal</button>
            <button @click="updateUser" :disabled="updating" class="px-4 py-2 bg-blue-600 text-white rounded">
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
  
  const users = ref([]);
  const selectedFile = ref(null);
  const loading = ref(false);
  const message = ref('');
  const success = ref(false);
  const hashKey = ref('');
  const mailUser = ref('');
  const mailPass = ref('');
  
  // edit modal state
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
      console.error(err);
      alert('Gagal menyimpan settings');
    }
  }
  
  const loadSettings = async () => {
    const res = await mainApi.get('settings');
    res.data.forEach(setting => {
      if (setting.key === 'HASH_KEY') hashKey.value = setting.value;
      if (setting.key === 'MAIL_USER') mailUser.value = setting.value;
      if (setting.key === 'MAIL_PASS') mailPass.value = setting.value;
    });
  }
  
  const getUserData = async () => {
    try {
      const res = await mainApi.get('users', { withCredentials: true });
      users.value = res.data.filter(e => e.role !== 'SUPERADMIN');
    } catch (err) {
      console.error(err);
    }
  }
  
  const openEdit = (user) => {
    editForm.value = {
      id_user: user.id_user,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' // kosongkan password by default
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
    try {
      // Prepare payload: only send password if not empty
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
      console.error(err);
      const msg = err?.response?.data?.message ?? 'Gagal update user';
      alert(msg);
    } finally {
      updating.value = false;
    }
  }
  
  const confirmDelete = async (id) => {
    if (!confirm('Hapus user ini? Aksi ini tidak dapat dibatalkan.')) return;
    try {
      await mainApi.delete(`users/${id}`, { withCredentials: true });
      alert('User berhasil dihapus');
      await getUserData();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message ?? 'Gagal menghapus user';
      alert(msg);
    }
  }
  
  /* existing upload/download functions kept as-is */
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
      console.error('Download gagal:', error);
      alert('Gagal download template. Silakan coba lagi.');
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
      console.error(err);
      alert('Gagal upload file');
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(async () => {
    await getUserData();
    await loadSettings();
  });
  </script>
  