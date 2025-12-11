<template>
  <div class="tab-content">
    
    <div class="toolbar-center">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Cari Folder" 
          v-model="searchQuery" 
        />
      </div>
    </div>

    <div class="folder-container-outline">
      
      <div v-if="isLoading" class="msg-center">
        Sedang memuat folder...
      </div>

      <div v-else-if="filteredFolders.length === 0" class="msg-center">
        Folder tidak ditemukan.
      </div>

      <div v-else class="folder-grid">
        <div 
          v-for="folder in filteredFolders" 
          :key="folder.id_file" 
          class="folder-card" 
          @click="bukaFolder(folder)"
        >
          <div class="folder-icon">📁 <span class="badge">🎓</span></div>
          <span class="folder-name">{{ folder.file_name }}</span>
          
          <span v-if="folder._count" style="font-size:0.7rem; color:#666; margin-left:auto;">
             {{ folder._count.children }} file
           </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// --- STATE ---
const folders = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

// URL Backend (Sesuaikan jika port beda)
const API_URL = 'http://localhost:3000/invitation/folders'; 

// --- FETCH DATA ---
const fetchFolders = async () => {
  isLoading.value = true;
  try {
    // Backend Anda sudah punya endpoint ini: GET /invitation/folders
    const response = await axios.get(API_URL, { withCredentials: true });
    folders.value = response.data;
  } catch (error) {
    console.error("Gagal ambil folder:", error);
    alert("Gagal memuat folder undangan.");
  } finally {
    isLoading.value = false;
  }
};

// --- FILTER SEARCH ---
const filteredFolders = computed(() => {
  if (!searchQuery.value) return folders.value;
  return folders.value.filter(f => 
    f.file_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- NAVIGASI ---
const bukaFolder = (folder) => {
  console.log("Membuka folder:", folder);
  
  // Kita kirim ID dan NAMA ke halaman berikutnya (TulisUndangan)
  router.push({ 
    name: 'TulisUndangan', 
    params: { 
      folderId: folder.id_file, // Penting: Kirim ID untuk query backend nanti
      folderName: folder.file_name 
    } 
  });
};

onMounted(() => {
  fetchFolders();
});
</script>

<style scoped>
/* --- STYLE ASLI ANDA (TIDAK SAYA UBAH, HANYA TAMBAH HELPER) --- */

.msg-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-style: italic;
  width: 100%;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-height: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.toolbar-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem; 
  position: relative;
  z-index: 2;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: 250px;
}
.search-box input {
  border: none;
  outline: none;
  margin-left: 0.5rem;
  width: 100%;
  background: transparent;
}

.folder-container-outline {
  border: 1px solid #3B82F6;
  border-radius: 16px;
  padding: 1.5rem 2rem; 
  flex: 1;
  min-height: 300px;
  position: relative;
  margin-top: 0;
  background: white;
  display: flex;      /* Tambahan agar loading/empty state bisa ditengah */
  flex-direction: column;
}

.folder-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-content: flex-start; /* Agar folder mulai dari atas */
  width: 100%;
}

.folder-card {
  border: 2px solid #60A5FA; 
  border-radius: 16px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden; 
}

.folder-card::before {
  content: "";
  position: absolute;
  width: 100%; 
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
    135deg,                      
    rgba(255, 255, 255, 0) 50%,   
    rgba(59, 131, 246, 0.63) 75%,  
    rgb(0, 98, 255) 100%  
  );
  filter: blur(5px); 
  border-radius: 16px; 
  z-index: 0;
  pointer-events: none;
}

.folder-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
  border-color: #2563EB; 
}

.folder-icon, .folder-name {
  position: relative;
  z-index: 1;
}

.folder-icon { font-size: 2rem; position: relative; }
.folder-icon .badge {
  font-size: 1rem;
  position: absolute;
  bottom: 0;
  right: -5px;
}
.folder-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #000;
}
</style>