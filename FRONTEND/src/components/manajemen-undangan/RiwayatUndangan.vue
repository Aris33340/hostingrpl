<template>
  <div class="tab-content">
    <div class="toolbar">
      
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Cari Folder" />
      </div>

      <button class="btn-filter">
        <SlidersHorizontalIcon :size="20" />
      </button>
    </div>

    <div class="table-container">
      <table class="history-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Kategori</th>
            <th>Undangan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 15" :key="i">
            <td>Nama Peserta {{ i }}</td>
            <td>peserta{{ i }}@email.com</td>
            <td>{{ i % 2 === 0 ? 'Mahasiswa' : 'Tamu' }}</td>
            <td>Yudisium</td>
            <td>
              <span class="status-badge" :class="i % 3 === 0 ? 'sent' : 'pending'">
                {{ i % 3 === 0 ? 'Terkirim' : 'Menunggu' }}
              </span>
            </td>
            <td class="action-cell">
               <button class="btn-action">Detail</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
// Import ikon yang dibutuhkan dari lucide-vue-next
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-vue-next';
</script>

<style scoped>
.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-height: 600px; /* Sedikit dipertinggi */
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

/* --- REVISI POIN 1: Style Search Container Putih --- */
.search-container {
  display: flex;
  align-items: center;
  background: white; /* Background Putih */
  border: 1px solid #ced4da; /* Border abu-abu halus */
  border-radius: 8px; /* Rounded corner */
  padding: 0.5rem 0.75rem;
  flex: 1; /* Mengisi ruang tersedia */
  max-width: 400px; /* Batas lebar maksimal */
}

.search-icon {
  color: #6c757d;
  margin-right: 0.5rem;
}

.search-container input {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  font-size: 0.95rem;
  color: #333;
}
.search-container input::placeholder {
  color: #adb5bd;
}

/* --- REVISI POIN 2: Style Tombol Filter --- */
.btn-filter {
  background: white;
  border: 1px solid #ced4da;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  transition: all 0.2s;
}
.btn-filter:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}


/* --- Tabel Styles --- */
.table-container {
  flex: 1;
  overflow-x: auto;
  border: 1px solid #eee;
  border-radius: 8px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap; /* Mencegah teks wrap ke bawah */
}

/* --- REVISI POIN 3: Header Rata Tengah --- */
th {
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #444;
  text-align: center; /* Header di tengah */
  border-bottom: 2px solid #eee;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  color: #333;
  text-align: center; /* Isi tabel juga di tengah agar rapi */
}

/* Style tambahan untuk data dummy agar terlihat lebih nyata */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
}
.status-badge.sent { background: #d1e7dd; color: #0f5132; }
.status-badge.pending { background: #fff3cd; color: #664d03; }

.action-cell {
  text-align: center;
}
.btn-action {
  padding: 0.25rem 0.75rem;
  background: #e7f1ff;
  color: #007bff;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-action:hover { background: #d0e4ff; }
</style>