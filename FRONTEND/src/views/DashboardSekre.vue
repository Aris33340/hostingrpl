<template>
  <div class="relative w-full min-h-screen overflow-hidden bg-gray-100">
    <img 
  src="@/assets/images/Background.png" 
  class="fixed top-0 left-0 w-full h-full object-cover z-0" 
  alt="Background" 
/>
    
    <div class="relative z-10 p-8 pt-10 ml-20"> 
      
      <div class="bg-white rounded-xl p-4 flex justify-between items-center shadow-md mb-6">
        <h2 class="text-xl font-bold text-[#2e3e85] pl-2">Beranda Kesekretariatan</h2>
        <span class="text-gray-600 pr-2">Halo, Admin!</span>
      </div>

      <div class="bg-white rounded-2xl p-8 text-center shadow-lg mb-8">
        <h1 class="text-3xl font-extrabold text-black mb-2">Selamat Datang di Dashboard Wisuda!!!</h1>
        <p class="text-sm text-gray-500">
          Kelola seluruh kegiatan wisuda dengan mudah dan efisien.<br>
          Mulai dari presensi hingga pembuatan buku wisuda.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-md text-center flex flex-col justify-center items-center h-40">
          <p class="text-xs font-bold text-gray-500 uppercase mb-2">TOTAL PESERTA</p>
          <h3 class="text-4xl font-bold text-blue-600 mb-2">325</h3>
          <p class="text-xs text-gray-400">Mahasiswa terdaftar</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-md text-center flex flex-col justify-center items-center h-40">
          <p class="text-xs font-bold text-gray-500 uppercase mb-2">JUMLAH HADIR</p>
          <h3 class="text-4xl font-bold text-blue-600 mb-2">189</h3>
          <p class="text-xs text-gray-400">Konfirmasi kehadiran</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-md text-center flex flex-col justify-center items-center h-40">
          <p class="text-xs font-bold text-gray-500 uppercase mb-2">TOTAL UNDANGAN</p>
          <h3 class="text-4xl font-bold text-blue-600 mb-2">325</h3>
          <p class="text-xs text-gray-400">Undangan terkirim</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-md text-center flex flex-col justify-center items-center h-40">
          <p class="text-xs font-bold text-gray-500 uppercase mb-2">DOKUMEN</p>
          <h3 class="text-4xl font-bold text-blue-600 mb-2">12</h3>
          <p class="text-xs text-gray-400">File aktif</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md">
        <h3 class="text-center font-bold text-lg mb-6">Rekomendasi Tindakan</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button @click="$router.push('/manajemen-mahasiswa')" class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-full shadow-sm text-sm">
            Kelola Mahasiswa
          </button>
          
          <button @click="$router.push('/editor')" class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-full shadow-sm text-sm">
            Edit Dokumen
          </button>
          
          <button @click="$router.push('/generate-qr')" class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-full shadow-sm text-sm">
            Kirim Undangan
          </button>
          
          <button class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-full shadow-sm text-sm">
            Panduan Pengguna
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Tidak ada script khusus, logika router sudah ditempel langsung di @click
</script>

<style scoped>
/* Tambahan style jika diperlukan */
</style>