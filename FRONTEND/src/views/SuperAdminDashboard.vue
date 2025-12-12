<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-cover bg-center"
    :style="{ backgroundImage: 'url(' + dashboardBg + ')' }">

    <div class="absolute inset-0 z-0 opacity-[0.1]"
      style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 32px 32px;">
    </div>

    <div class="absolute inset-0 bg-black/50 z-0"></div>

    <div
      class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob z-10">
    </div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000 z-10">
    </div>

    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-4xl max-h-4xl rounded-full bg-cyan-500/5 mix-blend-screen filter blur-[150px] opacity-20 z-10">
    </div>

    <div class="absolute bottom-0 left-0 z-10 hidden xl:block w-[300px] 2xl:w-[400px] pointer-events-none">
      <img :src="wisudawanImg" alt="Wisudawan"
        class="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] opacity-100 hover:scale-105 transition-transform duration-500" />
    </div>

    <div class="absolute bottom-0 right-0 z-10 hidden xl:block w-[300px] 2xl:w-[400px] pointer-events-none">
      <img :src="wisudawatiImg" alt="Wisudawati"
        class="w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] opacity-100 hover:scale-105 transition-transform duration-500" />
    </div>

    <div class="relative z-20 w-full max-w-6xl">

      <div class="absolute inset-0 pointer-events-none opacity-5">
        <font-awesome-icon :icon="faGear"
          class="absolute top-1/4 left-1/4 text-9xl text-cyan-400 animate-slow-spin animation-delay-3000" />
        <font-awesome-icon :icon="faDatabase"
          class="absolute bottom-1/4 right-1/4 text-9xl text-indigo-400 animate-slow-spin" />
        <font-awesome-icon :icon="faLayerGroup"
          class="absolute top-1/2 left-[60%] text-8xl text-purple-400 animate-slow-spin animation-delay-1500" />
      </div>

      <div class="text-center mb-14 space-y-4">

        <div class="relative inline-block mb-3">

          <img :src="graduationHatIcon" alt="Graduation Hat" class="absolute left-1/2 -top-10 md:-top-16 -translate-x-1/2 w-12 md:w-16 h-auto 
                      drop-shadow-[0_0_15px_rgba(255,255,0,0.4)] 
                      hover:scale-105 transition-transform duration-500" />

          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
            <span class="text-[12px] font-bold tracking-widest text-cyan-100 uppercase">Super Admin Portal</span>
          </div>
        </div>

        <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
          Selamat Datang, <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Super
            Admin!!!</span>
        </h1>

        <p class="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
          Pusat kendali terintegrasi Sistem Persiapan Wisuda Politeknik Statistika STIS.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

        <div @click="handleRoleSelected('SEKRETARIAT')"
          class="group relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-8 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">

          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
          </div>

          <div class="relative z-10 flex flex-col h-full">
            <div
              class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <h2 class="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">Modul
              Sekretariat</h2>
            <p class="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
              Verifikasi berkas, manajemen data mahasiswa, undangan, dan rekapitulasi presensi.
            </p>

            <div class="flex items-center text-blue-700 font-bold text-sm">
              <span>Akses Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        <div @click="handleRoleSelected('BUKUWISUDA')"
          class="group relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-8 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">

          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
          </div>

          <div class="relative z-10 flex flex-col h-full">
            <div
              class="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            <h2 class="text-2xl font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">Modul Buku
              Wisuda</h2>
            <p class="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
              Kelola biodata wisudawan, verifikasi foto, dan penyusunan layout buku otomatis.
            </p>

            <div class="flex items-center text-purple-700 font-bold text-sm">
              <span>Akses Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        <div @click="handleRoleSelected('PETUGAS')"
          class="group relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-8 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">

          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
          </div>

          <div class="relative z-10 flex flex-col h-full">
            <div
              class="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>

            <h2 class="text-2xl font-bold text-slate-800 mb-2 group-hover:text-cyan-700 transition-colors">Modul Petugas
            </h2>
            <p class="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
              Dashboard lapangan. Scan QR Code tamu dan pantau kehadiran real-time.
            </p>

            <div class="flex items-center text-cyan-600 font-bold text-sm">
              <span>Akses Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faDatabase, faLayerGroup } from '@fortawesome/free-solid-svg-icons'

// Assets gambar
import wisudawanImg from '@/assets/images/wisudawan.png'
import wisudawatiImg from '@/assets/images/wisudawati.png'
import graduationHatIcon from '@/assets/icons/graduationhat.png'
// --- [ BARU: Import Background Image ] ---
import dashboardBg from '@/assets/images/foto.jpg'
import { useAuthStore } from '../stores/authStore'
const router = useRouter()
const authStore = useAuthStore()

const handleRoleSelected = (role) => {
  authStore.setRole(role)
  if (role === "SEKRETARIAT") {
    router.push('/dashboard-sekre')
  } else if (role === "BUKUWISUDA") {
    router.push('/dashboard-buku')
  } else if (role === "PETUGAS") {
    router.push('/petugas')
  }
}
</script>

<style scoped>
/* Animasi untuk dekorasi latar belakang */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 10s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

/* NEW: Animasi putar lambat untuk Ikon Dekorasi */
@keyframes slowspin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-slow-spin {
  animation: slowspin 120s linear infinite;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}
</style>
