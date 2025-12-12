<template>
  <div class="write-page-container">
    
    <transition name="slide-fade">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <div class="toast-icon">
          {{ toast.type === 'success' ? '✅' : '❌' }}
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click="toast.show = false">×</button>
      </div>
    </transition>

    <button class="btn-back" @click="$router.go(-1)">Kembali</button>

    <div class="write-layout">
      
      <aside class="recipient-column" :class="{ 'expanded': isExpanded }">
        <div class="recipient-box">
          <div class="sidebar-header">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="Cari..." v-model="searchQuery" />
            </div>
            <div class="category-switch">
              <button class="switch-btn" :class="{ active: activeTab === 'mahasiswa' }" @click="activeTab = 'mahasiswa'">Mhs</button>
              <button class="switch-btn" :class="{ active: activeTab === 'tamu' }" @click="activeTab = 'tamu'">Tamu</button>
            </div>
          </div>

          <div class="recipient-content-wrapper">
            <div class="list-header-row">
              <label class="checkbox-container">
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                <span class="checkmark"></span>
                <span class="label-text" v-if="!isExpanded">Pilih Semua</span>
                <span class="label-text" v-else>Pilih Semua ({{ selectedIds.length }})</span>
              </label>
              <div v-if="isExpanded" class="expanded-columns-header">
                <span class="col-head">Detail Peserta</span>
                <span class="col-head">Kelas/Instansi</span>
                <span class="col-head">Lampiran</span>
              </div>
              <span v-else class="count-badge">{{ selectedIds.length }}</span>
            </div>

            <div class="recipient-list-container">
              <div v-if="loadingPeserta" class="loading-state">Memuat data...</div>
              <ul v-else class="recipient-list">
                <li v-for="item in currentList" :key="item.nim || item.id || Math.random()" class="recipient-item">
                  <div class="check-col">
                    <label class="checkbox-container small" v-if="getUniqueId(item)">
                      <input type="checkbox" :checked="isSelected(getUniqueId(item))" @change="toggleSelection(getUniqueId(item))" />
                      <span class="checkmark"></span>
                    </label>
                    <div v-else class="warning-icon" title="Data belum sinkron">⚠️</div>
                  </div>
                  
                  <div v-if="!isExpanded" class="info-compact">
                    <span class="recipient-name text-truncate">{{ item.nama }}</span>
                    <span class="recipient-sub text-truncate">{{ activeTab === 'mahasiswa' ? item.nim : item.email }}</span>
                  </div>

                  <div v-else class="info-expanded">
                    <div class="col-detail">
                      <span class="recipient-name">{{ item.nama }}</span>
                      <span class="recipient-sub">{{ item.email || item.nim }}</span>
                    </div>
                    <div class="col-detail">
                      <span class="info-text">{{ activeTab === 'mahasiswa' ? (item.kelas || '-') : (item.asal_instansi || 'Umum') }}</span>
                    </div>
                    <div class="col-detail">
                      <span :class="['file-badge', hasFile(item) ? 'exist' : 'missing']" :title="getFileName(item)">
                        {{ hasFile(item) ? '📄 ' + getFileName(item) : '❌ Belum ada file' }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="!loadingPeserta && currentList.length === 0" class="empty-state">Data tidak ditemukan</div>
            </div>

            <div class="sidebar-footer">
              <button class="btn-expand" @click="isExpanded = !isExpanded" :title="isExpanded ? 'Kecilkan' : 'Perbesar'">
                {{ isExpanded ? '⤡' : '⤢' }}
              </button>
              <button class="btn-add-recipient" @click="keManajemenPeserta">+ Penerima</button>
            </div>
          </div> 
        </div>
      </aside>

      <main class="editor-column">
        <div class="editor-box-container">
          <h2 class="folder-title">{{ folderName }}</h2>
          <div class="form-group">
            <label class="input-label">Subjek Email</label>
            <input type="text" class="input-subject" v-model="subject" placeholder="Masukkan judul email..." />
          </div>
          <div class="form-group editor-group">
            <label class="input-label">Isi Pesan</label>
            <textarea class="editor-content-area" v-model="messageBody" placeholder="Tulis pesan undangan di sini..."></textarea>
          </div>
          <div class="editor-actions">
            <div class="left-actions"><button class="btn-outline">Simpan Draf</button></div>
            <button class="btn-primary" @click="kirimUndangan" :disabled="isSubmitting">
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Undangan' }}
            </button>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mainApi } from '../api';

const route = useRoute();
const router = useRouter();
const folderId = route.params.folderId;
const folderName = computed(() => route.params.folderName || 'Tanpa Judul');

const activeTab = ref('mahasiswa');
const searchQuery = ref('');
const subject = ref('');
const messageBody = ref('');
const isSubmitting = ref(false);
const loadingPeserta = ref(false);
const isExpanded = ref(false);
const listMahasiswa = ref([]);
const listTamu = ref([]);
const selectedIds = ref([]); 

// --- TOAST STATE ---
const toast = ref({ show: false, type: 'success', title: '', message: '' });

const showToast = (type, title, message) => {
  toast.value = { show: true, type, title, message };
  setTimeout(() => { toast.value.show = false; }, 3000); // Hilang dalam 3 detik
};

const getUniqueId = (item) => item.peserta?.[0]?.id_peserta || null;
const getRealFile = (item) => item.peserta?.[0]?.files?.find(f => f.id_parent == folderId) || null;
const getFileName = (item) => getRealFile(item)?.file_name;
const hasFile = (item) => !!getRealFile(item);

const fetchPeserta = async () => {
  loadingPeserta.value = true;
  try {
    const [resMhs, resTamu] = await Promise.all([
      mainApi.get(`mahasiswa`, { withCredentials: true }),
      mainApi.get(`tamu`, { withCredentials: true })
    ]);
    listMahasiswa.value = resMhs.data;
    listTamu.value = resTamu.data;
  } catch (error) {
    console.error("Gagal load peserta:", error);
  } finally {
    loadingPeserta.value = false;
  }
};

const currentList = computed(() => {
  const source = activeTab.value === 'mahasiswa' ? listMahasiswa.value : listTamu.value;
  if (!searchQuery.value) return source;
  const q = searchQuery.value.toLowerCase();
  return source.filter(item => {
    const nama = (item.nama || '').toLowerCase();
    const info = (item.email || item.nim?.toString() || '').toLowerCase();
    return nama.includes(q) || info.includes(q);
  });
});

const isSelected = (id) => selectedIds.value.includes(id);
const toggleSelection = (id) => {
  if (isSelected(id)) selectedIds.value = selectedIds.value.filter(x => x !== id);
  else selectedIds.value.push(id);
};

const isAllSelected = computed(() => {
  const validItems = currentList.value.filter(item => getUniqueId(item) !== null);
  if (validItems.length === 0) return false;
  return validItems.every(item => selectedIds.value.includes(getUniqueId(item)));
});

const toggleSelectAll = (e) => {
  const currentIds = currentList.value.map(item => getUniqueId(item)).filter(id => id !== null);
  if (e.target.checked) selectedIds.value = [...new Set([...selectedIds.value, ...currentIds])];
  else selectedIds.value = selectedIds.value.filter(id => !currentIds.includes(id));
};

const keManajemenPeserta = () => router.push({ name: 'ManajemenPeserta' });

// --- KIRIM UNDANGAN (Tanpa Alert Browser) ---
const kirimUndangan = async () => {
  if (selectedIds.value.length === 0) {
    showToast('error', 'Gagal', 'Pilih minimal satu penerima.');
    return;
  }

  isSubmitting.value = true;
  try {
    await mainApi.post(`invitation/queue`, {
      folderId: parseInt(folderId),
      recipients: selectedIds.value,
      subject: subject.value,
      message: messageBody.value
    }, { withCredentials: true });

    // Notifikasi Sukses Halus
    showToast('success', 'Terkirim', 'Berhasil masuk antrian pengiriman.');
    
    // Redirect menggunakan PATH (Lebih aman dari error "No match")
    setTimeout(() => {
      router.push('/manajemen-undangan'); 
    }, 1500);

  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || error.message;
    showToast('error', 'Gagal', msg);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => fetchPeserta());
</script>

<style scoped>
/* CSS Dasar */
.write-page-container { padding: 2rem; height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; }
.btn-back { background: black; color: white; border: none; padding: 0.75rem 0; width: 320px; border-radius: 50px; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; z-index: 10; }
.write-layout { display: flex; gap: 2rem; flex: 1; min-height: 0; align-items: stretch; }

/* TOAST STYLE */
.toast-notification {
  position: fixed; top: 20px; right: 20px; z-index: 9999;
  background: white; border-radius: 12px; padding: 1rem 1.5rem;
  display: flex; align-items: center; gap: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15); min-width: 300px;
  border-left: 5px solid;
}
.toast-notification.success { border-left-color: #28a745; }
.toast-notification.error { border-left-color: #dc3545; }
.toast-icon { font-size: 1.5rem; }
.toast-content { flex: 1; }
.toast-title { font-weight: 700; font-size: 0.95rem; color: #333; }
.toast-message { font-size: 0.85rem; color: #666; margin-top: 2px; }
.toast-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #999; }

/* Animasi Slide */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(20px); opacity: 0; }

/* Sidebar & Search */
.recipient-column { width: 320px; display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
.recipient-column.expanded { width: 75%; }
.recipient-box { background: white; border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column; flex: 1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
.sidebar-header { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }

/* CSS FIX: Background Input Putih & Teks Hitam */
.search-box { flex: 1; display: flex; align-items: center; background: #f8f9fa !important; border: 1px solid #e9ecef; border-radius: 20px; padding: 0.5rem 1rem; min-width: 150px; }
.search-box input { border: none; outline: none; width: 100%; margin-left: 0.5rem; background: transparent !important; color: #333 !important; font-weight: 500; }
.search-box input::placeholder { color: #aaa; }

.category-switch { background: #f0f0f0; border-radius: 50px; padding: 4px; display: inline-flex; }
.switch-btn { border: none; background: transparent; padding: 6px 12px; border-radius: 50px; font-weight: 600; color: #666; cursor: pointer; font-size: 0.8rem; }
.switch-btn.active { background: #007bff; color: white; }

/* List Content */
.recipient-content-wrapper { flex: 1; display: flex; flex-direction: column; border-top: 1px solid #f0f0f0; padding-top: 1rem; min-height: 0; }
.list-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
.expanded-columns-header { display: flex; flex: 1; margin-left: 1rem; }
.col-head { flex: 1; font-weight: 700; font-size: 0.85rem; color: #555; }
.count-badge { font-size: 0.8rem; color: #888; font-weight: 500; }
.checkbox-container { display: flex; align-items: center; cursor: pointer; font-weight: 600; font-size: 0.9rem; color: #333; }
.checkbox-container input { margin-right: 8px; }
.recipient-list-container { flex: 1; overflow-y: auto; overflow-x: hidden; margin-bottom: 1rem; padding-right: 4px; }
.recipient-list-container::-webkit-scrollbar { width: 6px; }
.recipient-list-container::-webkit-scrollbar-thumb { background-color: #ddd; border-radius: 4px; }
.recipient-list { list-style: none; padding: 0; margin: 0; }
.recipient-item { display: flex; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f9f9f9; }
.recipient-item:hover { background: #fafafa; }
.check-col { width: 30px; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
.info-compact { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
.text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recipient-name { font-weight: 600; color: #333; font-size: 0.9rem; }
.recipient-sub { font-size: 0.75rem; color: #888; }
.info-expanded { display: flex; flex: 1; align-items: center; }
.col-detail { flex: 1; display: flex; flex-direction: column; padding-right: 10px; }
.info-text { font-size: 0.9rem; color: #555; }
.file-badge { padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; display: inline-block; }
.file-badge.exist { background: #e3f2fd; color: #1565c0; }
.file-badge.missing { background: #ffebee; color: #c62828; }
.warning-icon { color: #ff9800; font-size: 1.2rem; cursor: help; }
.sidebar-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; margin-top: auto; }
.btn-expand { background: none; border: 1px solid #007bff; color: #007bff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: grid; place-items: center; font-size: 1.2rem; transition: 0.2s; }
.btn-expand:hover { background: #e7f1ff; }
.btn-add-recipient { background: #007bff; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 50px; font-weight: 600; cursor: pointer; }

/* Editor */
.editor-column { flex: 1; display: flex; flex-direction: column; min-width: 300px; }
.editor-box-container { background: white; border-radius: 20px; padding: 2rem; flex: 1; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-top: -4.5rem; position: relative; z-index: 1; padding-top: 4rem; }
.folder-title { text-align: center; font-size: 1.5rem; font-weight: 700; color: #000; margin-bottom: 2rem; position: absolute; top: 1.5rem; left: 0; right: 0; }
.form-group { margin-bottom: 1.5rem; }
.input-label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.95rem; color: #000; }

/* CSS FIX: Teks Hitam di Input */
.input-subject { width: 100%; padding: 0.75rem; border: 1px solid #e0f7fa; background: #f0fbff; border-radius: 8px; outline: none; box-sizing: border-box; color: #000 !important; font-weight: 500; }
.input-subject::placeholder { color: #a0a0a0; }
.editor-group { flex: 1; display: flex; flex-direction: column; }
.editor-content-area { flex: 1; background: #f0fbff; border: 1px solid #e0f7fa; border-radius: 12px; padding: 1rem; resize: none; font-family: inherit; font-size: 1rem; outline: none; width: 100%; box-sizing: border-box; min-height: 200px; color: #000 !important; }
.editor-content-area::placeholder { color: #a0a0a0; }
.editor-actions { display: flex; justify-content: space-between; margin-top: 1.5rem; }
.left-actions { display: flex; gap: 1rem; }
.btn-outline { background: white; border: 1.5px solid #007bff; color: #007bff; padding: 0.6rem 1.5rem; border-radius: 50px; font-weight: 600; cursor: pointer; }
.btn-primary { background: #007bff; border: none; color: white; padding: 0.6rem 2rem; border-radius: 50px; font-weight: 600; cursor: pointer; }
.btn-primary:disabled { background: #ccc; cursor: not-allowed; }
.loading-state, .empty-state { text-align:center; padding:1rem; color:#ccc; }
</style>