<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <!-- <img 
  src="@/assets/images/Background.png" 
  class="fixed top-0 left-0 w-full h-full object-cover z-0" 
  alt="Background" 
/> -->

    <div class="relative z-10 mx-10">
      <section class="bg-white rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.18)] px-6 md:px-12 py-10 mt-2">
        <div class="text-center mb-6">
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#202020]">
            Selamat Datang di Dashboard
            <br>
            Sistem Persiapan Wisuda
          </h1>
          <p class="mt-3 text-lg md:text-base lg:text-xl text-gray-600 leading-relaxed">
            Kelola seluruh kegiatan wisuda dengan mudah dan efisien.<br />
            Mulai dari presensi hingga manajemen undangan.
          </p>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 px-2 md:px-6">
          <div class="flex-1 flex justify-center items-end gap-2 md:gap-3 mt-[-15px]">
            <img :src="cowoImg" class="w-[160px] md:w-[200px] lg:w-[300px] object-contain drop-shadow-2xl" />
            <img :src="ceweImg" class="w-[160px] md:w-[200px] lg:w-[300px] object-contain drop-shadow-2xl" />
          </div>

          <div class="flex-1 flex justify-center w-full">
            <div
              class="relative bg-white rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.20)] overflow-hidden w-full max-w-2xl h-[300px] md:h-[320px] lg:h-[360px]">
              <button
                class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-black text-2xl md:text-3xl font-bold hover:bg-gray-200 active:scale-95 transition"
                @click="prevSlide">
                ‹
              </button>

              <img :src="activeSlide.src" :alt="activeSlide.alt"
                class="w-full h-full object-cover transition-opacity duration-500 ease-in-out" 
                :class="{ 'opacity-0': isFading, 'opacity-100': !isFading }"
                />

              <button
                class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-black text-2xl md:text-3xl font-bold hover:bg-gray-200 active:scale-95 transition"
                @click="nextSlide">
                ›
              </button>

              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                <span v-for="(slide, i) in slides" :key="slide.id" class="w-2 h-2 md:w-3 md:h-3 rounded-full transition"
                  :class="i === activeIndex ? 'bg-[#377dff]' : 'bg-white/70 border border-gray-300'" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <StatCard title="TOTAL" subtitle="PESERTA WISUDA" :value="totalPesertaWisuda" />
          <StatCard title="TOTAL" subtitle="KEHADIRAN" :value="totalKehadiran" />
          <StatCard title="TOTAL" subtitle="UNDANGAN TERKIRIM" :value="totalUndanganTerkirim" />
          <StatCard title="TOTAL" subtitle="FILE UNGGAHAN" :value="totalFileUnggahan" />
        </div>
      </section>

      <section class="mt-8 pb-10" id="statistik">
        <div class="bg-white/95 rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.18)] px-8 py-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-[#202020]">Ringkasan Statistik</h2>
            <p class="mt-1 text-sm md:text-base text-gray-600">
              Data real-time dari manajemen tamu, mahasiswa, undangan, dan dashboard petugas scanner.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div class="bg-white rounded-[24px] shadow px-6 py-6 flex flex-col min-h-[300px]">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-bold text-gray-800">Total Peserta</h3>
                  <p class="text-[11px] text-gray-500">Gabungan Mahasiswa & Tamu</p>
                </div>
                <button @click="goToPage('/manajemen-mahasiswa')"
                  class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>
              <div class="flex flex-col items-center justify-center flex-1">
                <div class="relative w-48 h-48">
                  <div class="w-full h-full rounded-full" :style="donutPesertaStyle"></div>
                  <div
                    class="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span class="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</span>
                    <span class="text-3xl font-bold text-[#202020]">{{ formatNumber(totalPesertaWisuda) }}</span>
                  </div>
                </div>
                <div class="mt-6 flex gap-6 text-xs text-gray-600">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-[#0f4ba0]"></span>
                    <span>Mhs: <b>{{ formatNumber(infoPresensi.totalUndanganMahasiswa) }}</b></span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-[#22c1c3]"></span>
                    <span>Tamu: <b>{{ formatNumber(infoPresensi.totalUndanganTamu) }}</b></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[24px] shadow px-6 py-6 min-h-[300px]">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-bold text-gray-800">Kehadiran Mahasiswa per Prodi</h3>
                  <p class="text-[11px] text-gray-500">Gladi Wisuda vs Wisuda</p>
                </div>
                <button @click="goToPage('/petugas')"
                  class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>

              <div class="mt-6 space-y-5">
                <div v-for="prodi in prodiStatistik" :key="prodi.nama" class="space-y-2">
                  <div class="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{{ prodi.nama }}</span>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <div class="w-full bg-gray-100 rounded-full h-2.5 flex-1 relative overflow-hidden">
                        <div class="h-full bg-[#377dff]" :style="{ width: prodi.persenGladi + '%' }"></div>
                      </div>
                      <span class="text-[10px] text-gray-500 w-16 text-right">Gladi: {{ prodi.gladi }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-full bg-gray-100 rounded-full h-2.5 flex-1 relative overflow-hidden">
                        <div class="h-full bg-[#0f4ba0]" :style="{ width: prodi.persenWisuda + '%' }"></div>
                      </div>
                      <span class="text-[10px] text-gray-500 w-16 text-right">Wisuda: {{ prodi.wisuda }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex justify-center gap-4 mt-4 pt-4 border-t border-dashed">
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 bg-[#377dff] rounded-sm"></div>
                    <span class="text-[10px] text-gray-500">Gladi</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 bg-[#0f4ba0] rounded-sm"></div>
                    <span class="text-[10px] text-gray-500">Wisuda</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[24px] shadow px-6 py-6 flex flex-col items-center">
              <div class="w-full flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800 text-sm">Kehadiran Tamu</h3>
                <button @click="goToPage('/petugas')"
                  class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>
              <div class="relative w-36 h-36 mt-2">
                <div class="w-full h-full rounded-full" :style="donutKehadiranTamuStyle"></div>
                <div class="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                  <span class="text-[10px] text-gray-400">Total</span>
                  <span class="text-xl font-bold text-[#202020]">{{ formatNumber(infoPresensi.totalUndanganTamu)
                  }}</span>
                </div>
              </div>
              <div class="mt-4 w-full grid grid-cols-2 gap-2 text-center text-xs">
                <div class="bg-green-50 p-2 rounded-lg">
                  <div class="font-bold text-green-700">{{ formatNumber(infoPresensi.tamuHadir) }}</div>
                  <div class="text-green-600 text-[10px]">Hadir</div>
                </div>
                <div class="bg-red-50 p-2 rounded-lg">
                  <div class="font-bold text-red-700">{{ formatNumber(infoPresensi.tamuTidakHadir) }}</div>
                  <div class="text-red-600 text-[10px]">Belum</div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[24px] shadow px-6 py-6 flex flex-col items-center">
              <div class="w-full flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800 text-sm">Undangan Mahasiswa</h3>
                <button @click="goToPage('/manajemen-undangan')"
                  class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>
              <div class="relative w-36 h-36 mt-2">
                <div class="w-full h-full rounded-full" :style="donutUndanganMahasiswaStyle"></div>
                <div class="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                  <span class="text-[10px] text-gray-400">Terkirim</span>
                  <span class="text-xl font-bold text-[#202020]">{{ formatNumber(infoPresensi.totalUndanganMahasiswa)
                  }}</span>
                </div>
              </div>
              <div class="mt-4 w-full text-center text-xs">
                <div class="bg-blue-50 p-2 rounded-lg inline-block w-full">
                  <div class="text-blue-800 font-semibold">Status Pengiriman Email</div>
                  <div class="flex justify-center gap-3 mt-1">
                    <span class="text-blue-600">Sukses: <b>{{ formatNumber(infoPresensi.totalUndanganMahasiswa)
                    }}</b></span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-[24px] shadow px-6 py-6 flex flex-col items-center lg:col-span-2 xl:col-span-1">
              <div class="w-full flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800 text-sm">Undangan Tamu</h3>
                <button @click="goToPage('/manajemen-undangan')"
                  class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>
              <div class="flex flex-row items-center gap-6 w-full justify-center">
                <div class="relative w-36 h-36">
                  <div class="w-full h-full rounded-full" :style="donutUndanganTamuStyle"></div>
                  <div class="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                    <span class="text-[10px] text-gray-400">Terkirim</span>
                    <span class="text-xl font-bold text-[#202020]">{{ formatNumber(infoPresensi.totalUndanganTamu)
                    }}</span>
                  </div>
                </div>
                <div class="flex-1 text-xs space-y-2">
                  <p class="text-gray-500 leading-relaxed">
                    Ringkasan undangan yang berhasil dikirim ke tamu via Web Service / Email.
                  </p>
                  <div class="bg-blue-50 p-2 rounded-lg">
                    <span class="text-blue-700 font-bold block">{{ formatNumber(infoPresensi.totalUndanganTamu)
                    }}</span>
                    <span class="text-blue-600 text-[10px]">Email Terkirim</span>
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
const isFading = ref(false)
// --- FUNGSI NAVIGASI ---
const goToPage = (path) => {
  router.push(path)
}

// gambar ilustrasi
import ceweImg from '@/assets/images/cewe.png'
import cowoImg from '@/assets/images/cowo.png'
// foto wisuda
import foto1 from '@/assets/images/fotowi1.jpg'
import foto2 from '@/assets/images/fotowi2.jpg'

/* ================= SLIDER FOTO ================= */
const slides = ref([
  { id: 1, src: foto1, alt: 'Suasana wisuda 1' },
  { id: 2, src: foto2, alt: 'Suasana wisuda 2' }
])
const activeIndex = ref(0)
const activeSlide = computed(() => slides.value[activeIndex.value])

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % slides.value.length
}
const prevSlide = () => {
  activeIndex.value =
    (activeIndex.value - 1 + slides.value.length) % slides.value.length
}

/* ================= DATA RINGKASAN ================= */
const isLoading = ref(false)
const error = ref('')

const totalPesertaWisuda = ref(0)
const totalKehadiran = ref(0)
const totalUndanganTerkirim = ref(0)
const totalFileUnggahan = ref(0)

const infoPresensi = ref({
  totalUndangan: 0,
  totalUndanganMahasiswa: 0,
  mahasiswaHadir: 0,
  mahasiswaTidakHadir: 0,
  totalUndanganTamu: 0,
  tamuHadir: 0,
  tamuTidakHadir: 0
})

async function fetchSummary() {
  isLoading.value = true
  error.value = ''

  try {
    const { data: info } = await mainApi.get('presensi/count-status-presensi')
    infoPresensi.value = { ...infoPresensi.value, ...(info || {}) }

    const totMhs = info?.totalUndanganMahasiswa ?? 0
    const totTamu = info?.totalUndanganTamu ?? 0
    const totalSemua = totMhs + totTamu

    totalPesertaWisuda.value = totalSemua
    totalKehadiran.value = (info?.mahasiswaHadir ?? 0) + (info?.tamuHadir ?? 0)
    totalUndanganTerkirim.value = totalSemua

    try {
      const { data: files } = await mainApi.get('file')
      const arr = Array.isArray(files) ? files : Array.isArray(files?.data) ? files.data : []
      totalFileUnggahan.value = arr.length
    } catch (e) {
      totalFileUnggahan.value = 0
    }
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data ringkasan'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSummary()
})

/* ================= COMPUTED CHART DATA ================= */

const donutPesertaStyle = computed(() => {
  const mhs = infoPresensi.value.totalUndanganMahasiswa || 0
  const tamu = infoPresensi.value.totalUndanganTamu || 0
  const total = mhs + tamu || 1
  const persenMhs = Math.round((mhs / total) * 100)
  return {
    background: `conic-gradient(#0f4ba0 0 ${persenMhs}%, #22c1c3 ${persenMhs}% 100%)`
  }
})

const prodiStatistik = computed(() => {
  const dummy = [
    { nama: 'D3 Statistika', gladi: 110, wisuda: 123 },
    { nama: 'D4 Statistika', gladi: 160, wisuda: 175 },
    { nama: 'D4 Komputasi', gladi: 75, wisuda: 80 }
  ]
  const allValues = dummy.flatMap(d => [d.gladi, d.wisuda])
  const maxVal = Math.max(...allValues, 1)

  return dummy.map((d) => ({
    ...d,
    persenGladi: (d.gladi / maxVal) * 100,
    persenWisuda: (d.wisuda / maxVal) * 100
  }))
})

const donutKehadiranTamuStyle = computed(() => {
  const hadir = infoPresensi.value.tamuHadir || 0
  const belum = infoPresensi.value.tamuTidakHadir || 0
  const total = hadir + belum || 1
  const persenHadir = Math.round((hadir / total) * 100)
  return {
    background: `conic-gradient(#22c55e 0 ${persenHadir}%, #ef4444 ${persenHadir}% 100%)`
  }
})

const donutUndanganMahasiswaStyle = computed(() => {
  return { background: `conic-gradient(#3b82f6 0 100%)` }
})

const donutUndanganTamuStyle = computed(() => {
  return { background: `conic-gradient(#3b82f6 0 100%)` }
})

const formatNumber = (val) => {
  if (val == null || isNaN(val)) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}

const StatCard = {
  props: { title: String, subtitle: String, value: [Number, String] },
  computed: {
    formattedValue() {
      if (this.value == null) return '0'
      return new Intl.NumberFormat('id-ID').format(this.value)
    }
  },
  template: `
    <div class="bg-white rounded-[24px] shadow-[0_10px_24px_rgba(0,0,0,0.15)] px-4 py-4">
      <p class="text-[11px] font-semibold tracking-wide text-gray-600">{{ title }}</p>
      <p class="text-3xl font-extrabold text-[#2366d1] leading-tight mt-1">{{ formattedValue }}</p>
      <p class="text-[11px] font-semibold tracking-wide text-gray-700 mt-1 uppercase">{{ subtitle }}</p>
    </div>
  `
}
</script>

<style scoped></style>