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
              <span class="text-blue-100 text-xs md:text-sm font-semibold tracking-wide uppercase">Dashboard Buku</span>
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
              Kelola data mahasiswa, penyusunan buku wisuda, dan dokumen kelengkapan dengan mudah dan efisien dalam satu
              tampilan.
            </p>

            <div class="flex gap-8 pt-4">
              <div>
                <p class="text-3xl font-bold text-white">{{ formatNumber(totalMahasiswa) }}</p>
                <p class="text-xs text-blue-200 uppercase tracking-wider">Mahasiswa Terdaftar</p>
              </div>
              <div class="w-px h-12 bg-white/20"></div>
              <div>
                <p class="text-3xl font-bold text-white">{{ formatNumber(totalTemplateBuku) }}</p>
                <p class="text-xs text-blue-200 uppercase tracking-wider">File Terupload</p>
              </div>
            </div>
          </div>

          <div class="flex-1 w-full max-w-lg hidden lg:block">
            <div
              class="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-[32px] p-2 shadow-2xl transition duration-500">
              <div class="rounded-[24px] overflow-hidden h-[320px] relative bg-gray-800">
                <img :src="activeSlide.src" class="w-full h-full object-cover" />

                <div
                  class="absolute inset-0 flex justify-between items-center px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button @click="prevSlide"
                    class="w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 flex items-center justify-center">‹</button>
                  <button @click="nextSlide"
                    class="w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 flex items-center justify-center">›</button>
                </div>
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  <span v-for="(slide, i) in slides" :key="slide.id" class="w-2 h-2 rounded-full transition-all"
                    :class="i === activeIndex ? 'bg-blue-500 w-6' : 'bg-white/50'" />
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
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#1a237e]">Pusat Data & Statistik Buku</h2>
            <p class="mt-3 text-base md:text-lg text-gray-500">
              Visualisasi data real-time kelengkapan file dan sebaran mahasiswa per prodi.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div
              class="bg-white rounded-[32px] border border-gray-100 shadow-lg px-8 py-8 flex flex-col min-h-[380px] hover:translate-y-[-5px] transition-all duration-300">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">Total File Terupload</h3>
                  <p class="text-sm text-gray-500 mt-1">Klasifikasi berdasarkan jenis file</p>
                </div>
                <button @click="goToPage('/input-file')"
                  class="text-sm font-semibold text-[#2366d1] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                  Detail Data ➝
                </button>
              </div>

              <div class="flex flex-col items-center justify-center flex-1 col-span-3">
                <div class="relative w-56 h-56 md:w-64 md:h-64">
                  <div class="w-full h-full rounded-full transition-all duration-1000" :style="donutTemplateStyle">
                  </div>
                  <div
                    class="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
                    <span class="text-sm text-gray-400 font-semibold uppercase tracking-wider">Total</span>
                    <span class="text-5xl font-extrabold text-[#202020] mt-1">{{ formatNumber(totalTemplateBuku)
                    }}</span>
                  </div>
                </div>

                <div class="mt-8 flex flex-wrap justify-center gap-3 text-xs font-medium">
                  <div v-for="item in templateByJenis" :key="item.jenis"
                    class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></span>
                    <span class="text-gray-600">{{ item.jenis }}: <b class="text-gray-900">{{ formatNumber(item.jumlah)
                        }}</b></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[24px] shadow px-4 py-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-sm text-black">
                  Mahasiswa berdasarkan Prodi
                </h3>
                <button @click="goToPage('/manajemen-mahasiswa')"
                  class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>

              <div class="mt-4 space-y-4 text-xs">
                <div v-for="row in mahasiswaByProdiWithPercent" :key="row.prodi" class="space-y-1">
                  <div class="flex justify-between">
                    <span class="font-semibold text-gray-700">
                      {{ row.prodi }}
                    </span>
                    <span class="text-gray-600">
                      {{ formatNumber(row.jumlah) }} mahasiswa
                    </span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="h-2 rounded-full bg-[#2366d1]" :style="{ width: row.percent + '%' }"></div>
                  </div>
                </div>

                <p v-if="!mahasiswaByProdiWithPercent.length" class="text-[11px] text-gray-500 italic">
                  Belum ada data mahasiswa yang dapat ditampilkan.
                </p>
              </div>
            </div>

            <div
              class="bg-white rounded-[32px] lg:col-span-2 border border-gray-100 shadow-lg px-8 py-8 min-h-[380px] flex flex-col hover:translate-y-[-5px] transition-all duration-300">
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">Mahasiswa per Prodi</h3>
                  <p class="text-sm text-gray-500 mt-1">Jumlah mahasiswa terdaftar berdasarkan prodi</p>
                </div>
                <div class="flex flex-col items-end gap-3">

                  <button @click="goToPage('/manajemen-peserta')"
                    class="text-sm font-semibold text-[#2366d1] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    Detail Data ➝
                  </button>

                  <div class="text-xs font-medium text-gray-600">
                    Total: <b>{{ formatNumber(totalMahasiswa) }}</b> Mhs
                  </div>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
                <div class="space-y-5">
                  <div v-for="row in mahasiswaByProdiWithPercent" :key="row.prodi" class="group">
                    <div class="flex justify-between items-end mb-2">
                      <span class="text-sm font-bold text-gray-700">{{ row.prodi }}</span>
                      <span class="text-xs font-semibold text-[#2366d1] bg-blue-50 px-2 py-0.5 rounded">{{
                        formatNumber(row.jumlah) }} Mhs</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        class="h-full bg-[#377dff] rounded-full transition-all duration-1000 group-hover:bg-[#2e3e85]"
                        :style="{ width: row.percent + '%' }"></div>
                    </div>
                  </div>

                  <div v-if="!mahasiswaByProdiWithPercent.length" class="text-center text-gray-400 py-10 italic">
                    Belum ada data mahasiswa.
                  </div>
                </div>
              </div>
            </div>

            >>>>>>> origin/tya10des
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

// Assets
import foto1 from '@/assets/images/fotowi1.jpg'
import foto2 from '@/assets/images/fotowi2.jpg'

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
  activeIndex.value = (activeIndex.value - 1 + slides.value.length) % slides.value.length
}

/* ================= DATA STATISTIK ================= */
const isLoading = ref(false)
const totalMahasiswa = ref(0)
const totalTemplateBuku = ref(0)
const listMahasiswa = ref([])
const listFiles = ref([])

async function fetchSummary() {
  isLoading.value = true
  try {
    // 1. Ambil Data Mahasiswa
    const { data: mhs } = await mainApi.get('mahasiswa')
    const arrMhs = Array.isArray(mhs) ? mhs : mhs?.data || []
    listMahasiswa.value = arrMhs
    totalMahasiswa.value = arrMhs.length

    // 2. Ambil Data File
    const [resPdf, resImg] = await Promise.allSettled([
      mainApi.get('files?type=pdf'),
      mainApi.get('files?type=image')
    ])

    let combinedFiles = []
    if (resPdf.status === 'fulfilled' && Array.isArray(resPdf.value.data)) {
      combinedFiles = [...combinedFiles, ...resPdf.value.data]
    }
    if (resImg.status === 'fulfilled' && Array.isArray(resImg.value.data)) {
      combinedFiles = [...combinedFiles, ...resImg.value.data]
    }

    const uniqueFiles = [...new Map(combinedFiles.map(item => [item.id_file, item])).values()]
    listFiles.value = uniqueFiles
    totalTemplateBuku.value = uniqueFiles.length

  } catch (err) {
    console.error('Gagal memuat data ringkasan:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSummary()
})

/* ================= COMPUTED CHART DATA ================= */

const getFileType = (fileName) => {
  if (!fileName) return 'Lainnya'
  const ext = fileName.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'Gambar'
  if (ext === 'pdf') return 'PDF'
  return 'Lainnya'
}

const templateByJenis = computed(() => {
  const map = {}
  for (const f of listFiles.value) {
    const jenis = getFileType(f.file_name)
    if (!map[jenis]) map[jenis] = 0
    map[jenis]++
  }
  const warna = ['#22c1c3', '#0f4ba0', '#377dff', '#4ade80', '#facc15']
  return Object.entries(map).map(([jenis, jumlah], idx) => ({
    jenis,
    jumlah,
    color: warna[idx % warna.length]
  }))
})

const donutTemplateStyle = computed(() => {
  if (!templateByJenis.value.length) return { background: '#e5e7eb' }
  const total = templateByJenis.value.reduce((s, t) => s + t.jumlah, 0) || 1
  let start = 0
  const segments = templateByJenis.value.map((t) => {
    const percent = (t.jumlah / total) * 100
    const end = start + percent
    const seg = `${t.color} ${start}% ${end}%`
    start = end
    return seg
  })
  return { background: `conic-gradient(${segments.join(', ')})` }
})

const mahasiswaByProdiWithPercent = computed(() => {
  const map = {}
  for (const m of listMahasiswa.value) {
    const prodi = m.prodi || 'Tanpa Prodi'
    if (!map[prodi]) map[prodi] = 0
    map[prodi]++
  }
  const rows = Object.entries(map).map(([prodi, jumlah]) => ({ prodi, jumlah }))
  if (!rows.length) return []
  const max = Math.max(...rows.map((r) => r.jumlah)) || 1
  return rows.map((r) => ({
    ...r,
    percent: Math.round((r.jumlah / max) * 100)
  }))
})

const formatNumber = (val) => {
  if (val == null) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>