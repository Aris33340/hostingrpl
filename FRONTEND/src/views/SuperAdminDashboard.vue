<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-[#0e1b4d]">Selamat Datang, Super Admin</h1>
      <p class="text-gray-500 mt-2">Silakan pilih modul aplikasi wisuda yang ingin dikelola</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      
      <div @click="$router.push('/dashboard-sekre')" 
           class="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border border-blue-100 group relative overflow-hidden">
        <div class="absolute top-0 right-0 bg-blue-500 w-24 h-24 rounded-bl-full opacity-10 group-hover:scale-150 transition-transform"></div>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Modul Kesekretariatan</h2>
        <p class="text-gray-500 mb-6">Verifikasi berkas, manajemen mahasiswa, undangan, dan presensi.</p>
        <span class="text-blue-600 font-semibold flex items-center gap-2">
          Masuk Dashboard <span class="text-xl">→</span>
        </span>
      </div>

      <div @click="$router.push('/dashboard-buku')" 
           class="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border border-purple-100 group relative overflow-hidden">
        <div class="absolute top-0 right-0 bg-purple-500 w-24 h-24 rounded-bl-full opacity-10 group-hover:scale-150 transition-transform"></div>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Modul Buku Wisuda</h2>
        <p class="text-gray-500 mb-6">Kelola biodata, upload foto, dan layouting buku wisuda.</p>
        <span class="text-purple-600 font-semibold flex items-center gap-2">
          Masuk Dashboard <span class="text-xl">→</span>
        </span>
      </div>

    </div>
  </div>
</template>