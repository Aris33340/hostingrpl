<template>
  <div class="write-page-container">
    
    <button class="btn-back" @click="$router.go(-1)">Kembali</button>

    <div class="write-layout">
      
      <aside class="recipient-column">
        
        <div class="recipient-box">
          
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Cari Nama/Surel" />
          </div>
          
          <div class="category-switch-wrapper">
            <div class="category-switch">
              <button class="switch-btn active">Mahasiswa</button>
              <button class="switch-btn">Tamu</button>
            </div>
          </div>

          <div class="recipient-content-wrapper">
            
            <div class="select-all-row">
              <label class="checkbox-container">
                <input type="checkbox" id="selectAll" />
                <span class="checkmark"></span>
                <span class="label-text">Pilih Semua</span>
              </label>
            </div>

            <div class="recipient-list-container">
              <ul class="recipient-list">
                <li v-for="i in 8" :key="i" class="recipient-item">
                  <label class="checkbox-container small">
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                  </label>
                  <span class="recipient-name">Surel</span>
                </li>
              </ul>
            </div>

            <div class="sidebar-footer">
              <button class="btn-expand">⤢</button>
              <button class="btn-add-recipient">+ Penerima</button>
            </div>

          </div> </div>
      </aside>

      <main class="editor-column">
        <div class="editor-box-container">
          
          <h2 class="folder-title">{{ folderName }}</h2>

          <div class="form-group">
            <label class="input-label">Subjek Email</label>
            <input type="text" class="input-subject" />
          </div>

          <div class="form-group editor-group">
            <label class="input-label">Isi Pesan</label>
            <div class="editor-content-area">
              </div>
          </div>

          <div class="editor-actions">
            <div class="left-actions">
              <button class="btn-outline">Simpan Draf</button>
            </div>
            <button class="btn-primary">Kirim Undangan</button>
          </div>

        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const folderName = computed(() => route.params.folderName || 'Tanpa Judul');
</script>

<style scoped>
/* Layout Utama */
.write-page-container {
  padding: 2rem;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
}

.btn-back {
  background: black;
  color: white;
  border: none;
  padding: 0.75rem 0;
  width: 300px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  z-index: 10;
}

.write-layout {
  display: flex;
  gap: 2rem;
  flex: 1;
  min-height: 0; /* Penting untuk nested scroll */
  align-items: stretch;
}

/* --- SIDEBAR KIRI --- */
.recipient-column {
  width: 300px;
  display: flex;
  flex-direction: column;
}

.recipient-box {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: 250px;
  margin-bottom: 1rem;
}

.search-box input {
  border: none;
  outline: none;
  margin-left: 0.5rem;
  width: 100%;
  background: transparent;
}

.category-switch-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.category-switch {
  background: #f0f0f0;
  border-radius: 50px;
  padding: 4px;
  display: inline-flex;
}
.switch-btn {
  border: none;
  background: transparent;
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  font-size: 0.85rem;
}
.switch-btn.active {
  background: #007bff;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* REVISI 2: Wrapper Konten Bawah */
.recipient-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #f0f0f0; /* Garis pemisah halus */
  padding-top: 1rem;
  min-height: 0; /* Penting agar scroll berfungsi di dalam flex item */
}

.select-all-row {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f9f9f9;
}

/* Checkbox Style */
.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}
.checkbox-container input { margin-right: 8px; }

.recipient-list-container {
  flex: 1;
  overflow-y: auto; /* Scrollable list */
  margin-bottom: 1rem;
  padding-right: 4px; /* Ruang untuk scrollbar */
}
/* Styling Scrollbar List */
.recipient-list-container::-webkit-scrollbar {
  width: 4px;
}
.recipient-list-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 4px;
}

.recipient-list { list-style: none; padding: 0; margin: 0; }
.recipient-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #f9f9f9;
  font-size: 0.9rem;
  color: #555;
}

.sidebar-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  margin-top: auto; /* Dorong ke paling bawah wrapper */
}
.btn-expand {
  background: none; border: 1px solid #007bff; color: #007bff;
  width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
  display: grid; place-items: center; font-size: 1.2rem;
}
.btn-add-recipient {
  background: #007bff; color: white; border: none;
  padding: 0.5rem 1.5rem; border-radius: 50px; 
  font-weight: 600; cursor: pointer;
  transition: background 0.2s;
}
.btn-add-recipient:hover { background: #0056b3; }

/* --- KOLOM KANAN --- */
.editor-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-box-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-top: -4.5rem; 
  position: relative;
  z-index: 1; 
  padding-top: 4rem;
}

.folder-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 2rem;
  position: absolute;
  top: 1.5rem;
  left: 0;
  right: 0;
}

.form-group { margin-bottom: 1.5rem; }
.input-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #000;
}

.input-subject {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0f7fa;
  background: #f0fbff;
  border-radius: 8px;
  outline: none;
}

.editor-group { flex: 1; display: flex; flex-direction: column; }
.editor-content-area {
  flex: 1;
  background: #f0fbff;
  border: 1px solid #e0f7fa;
  border-radius: 12px;
  min-height: 200px;
}

.editor-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}
.left-actions { display: flex; gap: 1rem; }

/* REVISI 3: Tombol Outline Biru */
.btn-outline {
  background: white; 
  border: 1.5px solid #007bff; /* Border Biru */
  color: #007bff; /* Teks Biru */
  padding: 0.6rem 1.5rem; 
  border-radius: 50px; 
  font-weight: 600; 
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: #f0f8ff; /* Hover background biru sangat muda */
}

.btn-primary {
  background: #007bff; border: none; color: white;
  padding: 0.6rem 2rem; border-radius: 50px; font-weight: 600; cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #0056b3; }
</style>