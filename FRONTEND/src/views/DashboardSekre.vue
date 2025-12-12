<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <div class="relative z-10 p-8 pt-2">

      <section
        class="relative rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden min-h-[450px] flex items-center group">

        <div class="absolute inset-0 z-0">
          <img :src="foto1"
            class="w-full h-full object-cover transform transition-transform duration-[20s] ease-linear group-hover:scale-110"
            alt="Background Wisuda" />
        </div>

        <div class="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#1e3a8a]/80 to-transparent z-10"></div>

        <div class="relative z-20 px-8 md:px-12 py-12 w-full flex flex-col md:flex-row items-center gap-12">

          <div class="flex-1 text-left space-y-6">
            <div
              class="inline-block bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full px-4 py-1.5 mb-2">
              <span class="text-blue-100 text-xs md:text-sm font-semibold tracking-wide uppercase">Dashboard
                Sekretariatan</span>
            </div>

            <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              Selamat Datang <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Sistem Persiapan Wisuda
              </span>
              <br />
              <span class="text-2xl md:text-3xl text-white font-semibold mt-2 block tracking-wide">
                Politeknik Statistika STIS
              </span>
            </h1>

            <p class="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl font-light">
              Platform terintegrasi untuk mengelola seluruh rangkaian persiapan kegiatan wisuda.
              Pantau presensi, manajemen tamu, hingga distribusi undangan dalam satu tampilan modern.
            </p>

            <div class="flex gap-8 pt-4">
              <div>
                <p class="text-3xl font-bold text-white">{{ formatNumber(stats.summary.totalPeserta) }}</p>
                <p class="text-xs text-blue-200 uppercase tracking-wider">Peserta</p>
              </div>
              <div class="w-px h-12 bg-white/20"></div>
              <div>
                <p class="text-3xl font-bold text-white">{{ formatNumber(stats.invitation.mahasiswa.terkirim +
                  stats.invitation.tamu.terkirim) }}</p>
                <p class="text-xs text-blue-200 uppercase tracking-wider">Undangan Terkirim</p>
              </div>
            </div>
          </div>

          <div class="flex-1 w-full max-w-lg hidden lg:block">
            <div
              class="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-[32px] p-2 shadow-2xl transition duration-500">
              <div class="rounded-[24px] overflow-hidden h-[320px] relative">
                <img :src="activeSlide.src" class="w-full h-full object-cover" />

                <div
                  class="absolute inset-0 flex justify-between items-center px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button @click="prevSlide"
                    class="w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 flex items-center justify-center">‹</button>
                  <button @click="nextSlide"
                    class="w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 flex items-center justify-center">›</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section class="mt-12 pb-16" id="statistik">
        <div
          class="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-8 md:px-12 py-10 border border-gray-100">

          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#1a237e]">Pusat Data & Statistik</h2>
            <p class="mt-3 text-base md:text-lg text-gray-500">
              Visualisasi data real-time dari manajemen peserta, kehadiran scanner, dan distribusi undangan.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div
              class="bg-white rounded-[32px] border border-gray-100 shadow-lg px-8 py-8 flex flex-col min-h-[380px] hover:translate-y-[-5px] transition-all duration-300">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">Total Peserta Terdaftar</h3>
                  <p class="text-sm text-gray-500 mt-1">Gabungan Mahasiswa & Tamu</p>
                </div>
                <button @click="goToPage('/manajemen-peserta')"
                  class="text-sm font-semibold text-[#2366d1] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                  Detail Data ➝
                </button>
              </div>

              <div class="flex flex-col items-center justify-center flex-1">
                <div class="relative w-56 h-56 md:w-64 md:h-64">
                  <div class="w-full h-full rounded-full transition-all duration-1000" :style="donutPesertaStyle"></div>
                  <div
                    class="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
                    <span class="text-sm text-gray-400 font-semibold uppercase tracking-wider">Total</span>
                    <span class="text-5xl font-extrabold text-[#202020] mt-1">{{
                      formatNumber(stats.summary.totalPeserta) }}</span>
                  </div>
                </div>

                <div class="mt-8 flex justify-center gap-8 text-sm font-medium">
                  <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                    <span class="w-3 h-3 rounded-full bg-[#0f4ba0]"></span>
                    <span class="text-gray-600">Mhs: <b class="text-gray-900">{{
                      formatNumber(stats.summary.breakdownPeserta.mahasiswa) }}</b></span>
                  </div>
                  <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                    <span class="w-3 h-3 rounded-full bg-[#22c1c3]"></span>
                    <span class="text-gray-600">Tamu: <b class="text-gray-900">{{
                      formatNumber(stats.summary.breakdownPeserta.tamu) }}</b></span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-[32px] border border-gray-100 shadow-lg px-8 py-8 min-h-[380px] flex flex-col hover:translate-y-[-5px] transition-all duration-300">
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">Hasil Scanner Kehadiran</h3>
                  <p class="text-sm text-gray-500 mt-1">Perbandingan Tamu vs Mahasiswa</p>
                </div>

                <div class="flex flex-col items-end gap-3">
                  <button @click="goToPage('/petugas')"
                    class="text-sm font-semibold text-[#2366d1] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    Detail Data ➝
                  </button>
                  <div class="flex gap-3 text-xs font-medium text-gray-600">
                    <div class="flex items-center gap-1"><span
                        class="w-2.5 h-2.5 bg-[#1e3a8a] rounded-sm"></span><span>Tamu</span></div>
                    <div class="flex items-center gap-1"><span
                        class="w-2.5 h-2.5 bg-[#22d3ee] rounded-sm"></span><span>Mhs</span></div>
                  </div>
                </div>
              </div>

              <div class="flex-1 flex items-end justify-center gap-16 md:gap-24 pb-6 border-b border-gray-200">
                <div class="flex flex-col items-center gap-3 group w-20">
                  <span class="text-lg font-bold text-gray-800 mb-1 group-hover:-translate-y-1 transition-transform">{{
                    stats.summary.attendance.tamu }}</span>
                  <div
                    class="w-full bg-[#1e3a8a] rounded-t-lg transition-all duration-1000 ease-out relative group-hover:opacity-90 shadow-md"
                    :style="{ height: barHeightScannerTamu }">
                  </div>
                  <span class="text-sm font-bold text-gray-500">Tamu</span>
                </div>
                <div class="flex flex-col items-center gap-3 group w-20">
                  <span class="text-lg font-bold text-gray-800 mb-1 group-hover:-translate-y-1 transition-transform">{{
                    stats.summary.attendance.mahasiswa }}</span>
                  <div
                    class="w-full bg-[#22d3ee] rounded-t-lg transition-all duration-1000 ease-out relative group-hover:opacity-90 shadow-md"
                    :style="{ height: barHeightScannerMhs }">
                  </div>
                  <span class="text-sm font-bold text-gray-500">Mhs</span>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-[32px] border border-gray-100 shadow-lg px-8 py-8 min-h-[380px] flex flex-col lg:col-span-2 hover:translate-y-[-5px] transition-all duration-300">
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">Status Undangan (Email)</h3>
                  <p class="text-sm text-gray-500 mt-1">Jumlah email undangan yang berhasil terkirim</p>
                </div>
                <button @click="goToPage('/manajemen-undangan')"
                  class="text-sm font-semibold text-[#2366d1] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                  Detail Data ➝
                </button>
              </div>

              <div class="flex-1 flex items-end justify-center gap-20 md:gap-32 pb-6 border-b border-gray-200">
                <div class="flex flex-col items-center gap-3 group w-24">
                  <span class="text-lg font-bold text-gray-800 mb-1 group-hover:-translate-y-1 transition-transform">{{
                    stats.invitation.tamu.terkirim }}</span>
                  <div
                    class="w-full bg-[#1e3a8a] rounded-t-lg transition-all duration-1000 ease-out relative group-hover:opacity-90 shadow-md"
                    :style="{ height: barHeightInviteTamu }">
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-sm font-bold text-gray-600 mt-2">Tamu</span>
                    <span
                      class="text-[10px] text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full mt-1">Sukses</span>
                  </div>
                </div>

                <div class="flex flex-col items-center gap-3 group w-24">
                  <span class="text-lg font-bold text-gray-800 mb-1 group-hover:-translate-y-1 transition-transform">{{
                    stats.invitation.mahasiswa.terkirim }}</span>
                  <div
                    class="w-full bg-[#22d3ee] rounded-t-lg transition-all duration-1000 ease-out relative group-hover:opacity-90 shadow-md"
                    :style="{ height: barHeightInviteMhs }">
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-sm font-bold text-gray-600 mt-2">Mahasiswa</span>
                    <span
                      class="text-[10px] text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full mt-1">Sukses</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mainApi } from '@/api'

const router = useRouter()
const goToPage = (path) => router.push(path)
const statistikData = ref()

// Assets
import foto1 from '@/assets/images/fotowi1.jpg'
import foto2 from '@/assets/images/fotowi2.jpg'
import { showNotification } from '../composables/useNotification'
import { useLoading } from '../composables/useLoading'

const { show, hide } = useLoading()
const slides = ref([{ id: 1, src: foto1, alt: 'Suasana wisuda 1' }, { id: 2, src: foto2, alt: 'Suasana wisuda 2' }])
const activeIndex = ref(0)
const activeSlide = computed(() => slides.value[activeIndex.value])
const nextSlide = () => activeIndex.value = (activeIndex.value + 1) % slides.value.length
const prevSlide = () => activeIndex.value = (activeIndex.value - 1 + slides.value.length) % slides.value.length

const loadStatistikData = async () => {
  show()
  try {
    const response = await mainApi.get('presensi/statistik-data')
    statistikData.value = response.data
  } catch (error) {
    showNotification('error', error.message || 'Gagal memuat data statistik.')
  } finally {
    hide()
  }
}
// Data State
const isLoading = ref(false)
const stats = ref({
  summary: {
    totalPeserta: 0,
    breakdownPeserta: { mahasiswa: 0, tamu: 0 },
    attendance: { mahasiswa: 0, tamu: 0 },
    kehadiranTamu: { total: 0, hadir: 0, belum: 0 }
  },
  invitation: { mahasiswa: { terkirim: 0 }, tamu: { terkirim: 0 } }
})

// Fetch Data
async function fetchDashboardData() {
  isLoading.value = true
  try {
    const [resSummary, resInvite] = await Promise.all([
      mainApi.get('dashboard/summary'),
      mainApi.get('dashboard/chart-invitation')
    ])
    if (resSummary.data) stats.value.summary = resSummary.data
    if (resInvite.data) stats.value.invitation = resInvite.data
  } catch (err) {
    showNotification('error',err.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadStatistikData()
  fetchDashboardData()
})

// --- COMPUTED FOR CHARTS ---

// 1. Bar Height: Scanner (Minimal 5% agar bar terlihat)
const barHeightScannerTamu = computed(() => {
  const val = stats.value.summary.attendance.tamu
  const max = Math.max(val, stats.value.summary.attendance.mahasiswa, 10)
  return `${Math.max((val / max) * 100, 5)}%`
})
const barHeightScannerMhs = computed(() => {
  const val = stats.value.summary.attendance.mahasiswa
  const max = Math.max(val, stats.value.summary.attendance.tamu, 10)
  return `${Math.max((val / max) * 100, 5)}%`
})

// 2. Bar Height: Undangan
const barHeightInviteTamu = computed(() => {
  const val = stats.value.invitation.tamu.terkirim
  const max = Math.max(val, stats.value.invitation.mahasiswa.terkirim, 10)
  return `${Math.max((val / max) * 100, 5)}%`
})
const barHeightInviteMhs = computed(() => {
  const val = stats.value.invitation.mahasiswa.terkirim
  const max = Math.max(val, stats.value.invitation.tamu.terkirim, 10)
  return `${Math.max((val / max) * 100, 5)}%`
})

// 3. Donut Chart Colors
const donutPesertaStyle = computed(() => {
  const mhs = stats.value.summary.breakdownPeserta.mahasiswa
  const total = stats.value.summary.totalPeserta || 1
  const persenMhs = Math.round((mhs / total) * 100)
  return { background: `conic-gradient(#0f4ba0 0 ${persenMhs}%, #22c1c3 ${persenMhs}% 100%)` }
})

const formatNumber = (val) => {
  if (val == null || isNaN(val)) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}
</script>

<style scoped></style>
