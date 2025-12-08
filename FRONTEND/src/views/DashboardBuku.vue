<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <!-- <img 
      src="@/assets/images/Background.png" 
      class="fixed top-0 left-0 w-full h-full object-cover z-0" 
      alt="Background" 
    /> -->
    
    <div class="relative z-10 p-8 pt-10 ml-20"> 
      
      <div class="bg-white rounded-xl p-4 flex justify-between items-center shadow-md mb-6">
        <h2 class="text-xl font-bold text-[#2e3e85] pl-2">Beranda Buku Wisuda</h2>
        <span class="text-gray-600 pr-2">Halo, Admin!</span>
      </div>

      <div class="bg-white rounded-2xl p-8 text-center shadow-lg mb-8">
        <h1 class="text-3xl font-extrabold text-black mb-2">Selamat Datang di Dashboard Wisuda!!!</h1>
        <p class="text-sm text-gray-500">
          Kelola seluruh kegiatan wisuda dengan mudah dan efisien.<br>
          Mulai dari presensi hingga pembuatan buku wisuda.
        </p>
      </div>

      <div class="flex flex-col md:flex-row justify-center gap-6 mb-8">
        
        <div class="bg-white p-6 rounded-2xl shadow-md text-center flex flex-col justify-center items-center w-full md:w-1/4 h-40">
          <p class="text-xs font-bold text-gray-500 uppercase mb-2">TOTAL PESERTA</p>
          <h3 class="text-4xl font-bold text-blue-600 mb-2">325</h3>
          <p class="text-xs text-gray-400">Mahasiswa terdaftar</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-md text-center flex flex-col justify-center items-center w-full md:w-1/4 h-40">
          <p class="text-xs font-bold text-gray-500 uppercase mb-2">DOKUMEN</p>
          <h3 class="text-4xl font-bold text-blue-600 mb-2">12</h3>
          <p class="text-xs text-gray-400">File aktif</p>
        </div>

      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md">
        <h3 class="text-center font-bold text-lg mb-6">Rekomendasi Tindakan</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-0 md:px-20">
          
          <button @click="$router.push('/manajemen-mahasiswa')" class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-full shadow-sm text-sm transition-colors">
            Kelola Mahasiswa
          </button>
          
          <button @click="$router.push('/editor')" class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-full shadow-sm text-sm transition-colors">
            Edit Dokumen
          </button>
          
          <button class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-full shadow-sm text-sm transition-colors">
            Panduan Pengguna
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Logika script bisa ditambahkan nanti
</script>