<template>
  <div class="tab-content">
    
    <div class="toolbar">
      <div class="search-container">
        <SearchIcon class="search-icon" :size="20" />
        
        <input 
          type="text" 
          placeholder="Cari Nama, Email, atau Folder" 
          v-model="searchQuery" 
        />
      </div>

      <button class="btn-refresh" @click="fetchData(false)" title="Refresh Data">
        <RefreshCwIcon :size="20" :class="{ 'spin': isLoading }" />
      </button>
    </div>

    <div v-if="isLoading && rawData.length === 0" class="state-msg">
      Sedang memuat data...
    </div>
    
    <div v-else-if="errorMsg" class="state-msg error">{{ errorMsg }}</div>

    <div v-else class="table-container">
      <table class="history-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Kategori</th>
            <th>Undangan (Folder)</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredData.length === 0">
            <td colspan="7" class="empty-cell">Tidak ada data ditemukan</td>
          </tr>

          <tr v-for="(item, index) in filteredData" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.email }}</td>
            <td>
              <span :class="['badge-kategori', item.kategori === 'Mahasiswa' ? 'mhs' : 'tamu']">
                {{ item.kategori }}
              </span>
            </td>
            <td>{{ item.undangan }}</td>
            
            <td>
              <span :class="['status-badge', getStatusClass(item.statusCode)]">
                {{ getStatusLabel(item.statusCode) }}
              </span>
              <div v-if="item.statusCode === 0" class="error-detail">
                {{ item.errorDetail }}
              </div>
            </td>

            <td class="action-cell">
              <button 
                v-if="item.statusCode === 0" 
                class="btn-retry" 
                @click="retryEmail(item.id)"
                :disabled="isRetrying"
              >
                ↻ Kirim Ulang
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'; // Tambah onUnmounted
import axios from 'axios';
import { SearchIcon, RefreshCwIcon } from 'lucide-vue-next'; 

// --- STATE ---
const rawData = ref([]);
const isLoading = ref(true);
const errorMsg = ref('');
const searchQuery = ref('');
const isRetrying = ref(false);
let pollingInterval = null; // Variabel untuk menyimpan timer

const API_URL = 'http://localhost:3000/invitation'; 

// --- FETCH DATA ---
// isBackground = true artinya refresh diam-diam (tanpa loading spinner)
const fetchData = async (isBackground = false) => {
  if (!isBackground) {
    isLoading.value = true;
  }
  errorMsg.value = '';
  
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    rawData.value = processData(response.data);
  } catch (error) {
    console.error("Error:", error);
    // Hanya tampilkan error jika ini bukan refresh otomatis
    if (!isBackground) {
      errorMsg.value = 'Gagal mengambil data. Pastikan Backend aktif.';
    }
  } finally {
    isLoading.value = false;
  }
};

// --- LOGIC MAPPING ---
const processData = (apiResponse) => {
  return apiResponse.map(item => {
    const p = item.peserta || {};
    const isMahasiswa = !!p.mahasiswa;
    const detailOrang = isMahasiswa ? p.mahasiswa : p.tamu;

    let namaFinal = 'Tanpa Nama';
    let emailFinal = '-';

    if (detailOrang) {
      namaFinal = detailOrang.nama;
      if (isMahasiswa) {
        emailFinal = detailOrang.nim ? `${detailOrang.nim}@stis.ac.id` : '-';
      } else {
        emailFinal = detailOrang.email || '-';
      }
    }

    return {
      id: item.id_sendStatus,
      nama: namaFinal,
      email: emailFinal,
      kategori: isMahasiswa ? 'Mahasiswa' : 'Tamu',
      undangan: item.folder ? item.folder.file_name : '-',
      statusCode: item.status, 
      errorDetail: item.errorMessage
    };
  });
};

// --- RETRY ---
const retryEmail = async (id) => {
  if (!confirm("Kirim ulang undangan?")) return;
  isRetrying.value = true;
  try {
    await axios.put(`${API_URL}/retry/${id}`, {}, { withCredentials: true });
    
    // Refresh data langsung agar status berubah jadi Pending
    await fetchData(true); 
    alert("Berhasil masuk antrian.");
  } catch (error) {
    alert("Gagal kirim ulang.");
  } finally {
    isRetrying.value = false;
  }
};

// --- HELPERS ---
const getStatusLabel = (c) => (c === 2 ? 'Terkirim' : c === 0 ? 'Gagal' : 'Pending');
const getStatusClass = (c) => (c === 2 ? 'sent' : c === 0 ? 'failed' : 'pending');

// --- FILTER ---
const filteredData = computed(() => {
  if (!searchQuery.value) return rawData.value;
  const q = searchQuery.value.toLowerCase();
  return rawData.value.filter(item => 
    item.nama.toLowerCase().includes(q) || 
    item.email.toLowerCase().includes(q) ||
    item.undangan.toLowerCase().includes(q)
  );
});

// --- LIFECYCLE ---
onMounted(() => {
  fetchData(); // Load pertama kali
  
  // Mulai Auto-Refresh setiap 5 detik (5000 ms)
  pollingInterval = setInterval(() => {
    fetchData(true); // true = refresh diam-diam
  }, 5000);
});

onUnmounted(() => {
  // Matikan Auto-Refresh saat pindah halaman (PENTING agar tidak memory leak)
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
/* Container Utama */
.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-height: 600px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.search-container {
  display: flex;
  align-items: center;
  background: white !important; 
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  color: #6c757d; 
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.search-container input {
  background-color: transparent !important; 
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #333 !important; 
  box-shadow: none !important;
}

.btn-refresh {
  background: white;
  border: 1px solid #ced4da;
  border-radius: 8px;
  width: 42px; 
  height: 42px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  color: #555 !important;
  transition: all 0.2s;
}
.btn-refresh:hover {
  background: #f8f9fa;
  color: #000 !important;
  border-color: #adb5bd;
}

/* Efek Putar saat loading manual */
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

/* Table Styles */
.table-container { flex: 1; overflow-x: auto; border: 1px solid #eee; border-radius: 8px; }
.history-table { width: 100%; border-collapse: collapse; white-space: nowrap; }

th { background: #f8f9fa; padding: 1rem; font-weight: 600; color: #444; text-align: center; border-bottom: 2px solid #eee; }
td { padding: 0.75rem 1rem; border-bottom: 1px solid #eee; color: #333; text-align: center; }

/* Status Badges */
.status-badge { padding: 4px 10px; border-radius: 50px; font-size: 0.85rem; font-weight: 500; }
.status-badge.sent { background: #d1e7dd; color: #0f5132; }
.status-badge.pending { background: #fff3cd; color: #856404; }
.status-badge.failed { background: #f8d7da; color: #721c24; }

/* Category Badges */
.badge-kategori { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
.badge-kategori.mhs { background: #cff4fc; color: #055160; }
.badge-kategori.tamu { background: #e2e3e5; color: #383d41; }

.state-msg { text-align: center; padding: 2rem; color: #666; }
.state-msg.error { color: #dc3545; }
.error-detail { font-size: 0.75rem; color: #dc3545; margin-top: 4px; font-style: italic; }

.btn-retry {
  background-color: #ffc107; color: #333; border: none; padding: 6px 12px;
  border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;
}
.btn-retry:hover { background-color: #e0a800; }
</style>