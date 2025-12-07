<template>
  <div class="tab-content">
    
    <div class="toolbar-center">
      
      
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Cari Folder" />
      </div>
    </div>

    <div class="folder-container-outline">
      
      <div class="folder-grid">
        <div class="folder-card" @click="bukaFolder('Yudisium')">
          <div class="folder-icon">📁 <span class="badge">🎓</span></div>
          <span class="folder-name">Yudisium</span>
        </div>

        <div class="folder-card" @click="bukaFolder('Wisuda')">
          <div class="folder-icon">📁 <span class="badge">🎓</span></div>
          <span class="folder-name">Wisuda</span>
        </div>

        <div class="folder-card" @click="bukaFolder('Gladi Bersih')">
          <div class="folder-icon">📁 <span class="badge">🎓</span></div>
          <span class="folder-name">Gladi Bersih</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const bukaFolder = (namaFolder) => {
  router.push({ 
    name: 'TulisUndangan', 
    params: { folderName: namaFolder } 
  });
};
</script>

<style scoped>
.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-height: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

/* --- REVISI: Toolbar Center --- */
.toolbar-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* Menambah jarak yang cukup antara tombol dan box di bawahnya */
  margin-bottom: 2rem; 
  position: relative;
  z-index: 2;
}

.btn-import {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 4px rgba(0,123,255,0.3);
}
.btn-import:hover { background-color: #0056b3; }

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

/* --- REVISI UTAMA: Box Outline Biru --- */
/* src/components/manajemen-undangan/BuatUndangan.vue */

.folder-container-outline {
  border: 1px solid #3B82F6;
  border-radius: 16px;
  
  /* REVISI DI SINI: */
  /* Ubah dari '3rem 2rem' menjadi '1.5rem 2rem' */
  /* Ini akan mengurangi jarak atas secara signifikan */
  padding: 1.5rem 2rem; 
  
  flex: 1;
  min-height: 300px;
  position: relative;
  margin-top: 0;
  background: white;
}

.folder-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.folder-card {
  /* REVISI 1: Border lebih tebal dan biru lebih tegas */
  border: 2px solid #60A5FA; /* Biru muda yang lebih vibrant (Tailwind Blue-400) */
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

/* Update di bagian <style scoped> */

.folder-card::before {
  content: "";
  position: absolute;
  
  /* Kita sesuaikan ukurannya agar menutupi seluruh tombol
     supaya linear gradient bisa berjalan mulus dari ujung ke ujung */
  width: 100%; 
  height: 100%;
  top: 0;
  left: 0;
  
  /* --- GANTI MENJADI LINEAR GRADIENT --- */
  background: linear-gradient(
    135deg,                       /* Arah diagonal ke kanan-bawah */
    rgba(255, 255, 255, 0) 50%,   /* Transparan total di separuh awal */
    rgba(59, 131, 246, 0.63) 75%,  /* Mulai membiru halus */
    rgb(0, 98, 255) 100%  /* Biru lebih tegas di pojok kanan bawah */
  );
  
  /* Blur opsional: Jika ingin terlihat sangat tajam, hapus baris ini.
     Tapi sedikit blur biasanya membuat gradasi lebih menyatu. */
  filter: blur(5px); 
  
  /* Hapus border-radius 50% karena kita mau memenuhi kotak */
  border-radius: 16px; 
  
  z-index: 0;
  pointer-events: none;
}


/* Efek Hover: Lebih 'naik' dan border lebih biru */
.folder-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
  border-color: #2563EB; /* Biru lebih gelap saat hover */
}

/* Pastikan teks & ikon di atas gradasi */
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