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

      <section
        class="bg-white rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.18)] px-6 md:px-12 py-10 mt-2"
      >
        <div class="text-center mb-6">
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#202020]">
            Selamat Datang di Dashboard Wisuda!!!
          </h1>
          <p class="mt-3 text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
            Kelola seluruh kegiatan wisuda dengan mudah dan efisien.<br />
            Mulai dari presensi hingga penyusunan buku wisuda.
          </p>
        </div>

        <div
          class="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 px-2 md:px-6"
        >
          <div
            class="flex-1 flex justify-center items-end gap-2 md:gap-3 mt-[-15px]"
          >
            <img
              :src="cowoImg"
              class="w-[160px] md:w-[200px] lg:w-[300px] object-contain drop-shadow-2xl"
            />
            <img
              :src="ceweImg"
              class="w-[160px] md:w-[200px] lg:w-[300px] object-contain drop-shadow-2xl"
            />
          </div>

          <div class="flex-1 flex justify-center w-full">
            <div
              class="relative bg-white rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.20)] overflow-hidden w-full max-w-2xl h-[300px] md:h-[320px] lg:h-[360px]"
            >
              <button
                class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg
                       flex items-center justify-center text-black text-2xl md:text-3xl font-bold
                       hover:bg-gray-200 active:scale-95 transition"
                @click="prevSlide"
              >
                ‹
              </button>

              <img
                :src="activeSlide.src"
                :alt="activeSlide.alt"
                class="w-full h-full object-cover"
              />

              <button
                class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg
                       flex items-center justify-center text-black text-2xl md:text-3xl font-bold
                       hover:bg-gray-200 active:scale-95 transition"
                @click="nextSlide"
              >
                ›
              </button>

              <div
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20"
              >
                <span
                  v-for="(slide, i) in slides"
                  :key="slide.id"
                  class="w-2 h-2 md:w-3 md:h-3 rounded-full transition"
                  :class="
                    i === activeIndex
                      ? 'bg-[#377dff]'
                      : 'bg-white/70 border border-gray-300'
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-4">
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center"
        >
          <StatCard
            title="TOTAL"
            subtitle="MAHASISWA TERDAFTAR"
            :value="totalMahasiswa"
          />
          <StatCard
            title="TOTAL"
            subtitle="FILE / TEMPLATE TERUPLOAD"
            :value="totalTemplateBuku"
          />
        </div>

        <div class="mt-2 text-xs h-4">
          <span v-if="isLoading" class="text-gray-500">
            Memuat data ringkasan...
          </span>
        </div>
      </section>

      <section class="mt-8 pb-10">
        <div
          class="bg-white/95 rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.18)] px-8 py-8"
        >
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-[#202020]">
              Ringkasan Statistik
            </h2>
            <p class="mt-1 text-sm md:text-base text-gray-600">
              Mulai dari daftar peserta, dokumen, undangan, dan presensi hingga
              penyusunan buku wisuda.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-[24px] shadow px-4 py-4 flex flex-col">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-sm">
                  Total File berdasarkan Jenis
                </h3>
                <button @click="goToPage('/input-file')" class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>
              <div class="flex flex-col items-center justify-center flex-1">
                <div class="relative w-44 h-44 mb-3">
                  <div
                    class="w-full h-full rounded-full"
                    :style="donutTemplateStyle"
                  ></div>
                  <div
                    class="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center"
                  >
                    <span class="text-[11px] text-gray-500">Total</span>
                    <span class="text-2xl font-bold text-[#2366d1]">
                      {{ formatNumber(totalTemplateBuku) }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-wrap justify-center gap-4 text-xs">
                  <div
                    v-for="item in templateByJenis"
                    :key="item.jenis"
                    class="flex items-center gap-1"
                  >
                    <span
                      class="inline-block w-3 h-3 rounded-full"
                      :style="{ backgroundColor: item.color }"
                    />
                    <span>{{ item.jenis }}: {{ formatNumber(item.jumlah) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[24px] shadow px-4 py-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-sm">
                  Mahasiswa berdasarkan Prodi
                </h3>
                <button @click="goToPage('/manajemen-mahasiswa')" class="text-xs font-semibold text-[#2366d1] hover:underline bg-blue-50 px-2 py-1 rounded">
                  More Info ➝
                </button>
              </div>

              <div class="mt-4 space-y-4 text-xs">
                <div
                  v-for="row in mahasiswaByProdiWithPercent"
                  :key="row.prodi"
                  class="space-y-1"
                >
                  <div class="flex justify-between">
                    <span class="font-semibold text-gray-700">
                      {{ row.prodi }}
                    </span>
                    <span class="text-gray-600">
                      {{ formatNumber(row.jumlah) }} mahasiswa
                    </span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div
                      class="h-2 rounded-full bg-[#2366d1]"
                      :style="{ width: row.percent + '%' }"
                    ></div>
                  </div>
                </div>

                <p
                  v-if="!mahasiswaByProdiWithPercent.length"
                  class="text-[11px] text-gray-500 italic"
                >
                  Belum ada data mahasiswa yang dapat ditampilkan.
                </p>
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

// Navigasi
const goToPage = (path) => {
  router.push(path)
}

// ilustrasi
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

const totalMahasiswa = ref(0)
const totalTemplateBuku = ref(0)

// Data mentah
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

    // 2. Ambil Data File (PERBAIKAN UTAMA DI SINI)
    // Karena backend error jika type kosong, kita request per tipe (pdf dan image) lalu digabung.
    const [resPdf, resImg] = await Promise.allSettled([
      mainApi.get('files?type=pdf'),
      mainApi.get('files?type=image')
    ])

    let combinedFiles = []
    
    // Gabungkan hasil PDF jika sukses
    if (resPdf.status === 'fulfilled' && Array.isArray(resPdf.value.data)) {
      combinedFiles = [...combinedFiles, ...resPdf.value.data]
    }
    
    // Gabungkan hasil Image jika sukses
    if (resImg.status === 'fulfilled' && Array.isArray(resImg.value.data)) {
      combinedFiles = [...combinedFiles, ...resImg.value.data]
    }

    // Hilangkan duplikat jika ada (berdasarkan id_file)
    const uniqueFiles = [...new Map(combinedFiles.map(item => [item.id_file, item])).values()]

    listFiles.value = uniqueFiles
    totalTemplateBuku.value = uniqueFiles.length

  } catch (err) {
    console.error('Gagal memuat data ringkasan:', err)
  } finally {
    isLoading.value = false
  }
}

/* ================= STATISTIK FILE (TEMPLATE) ================= */

// Helper: Tentukan jenis file dari ekstensi
const getFileType = (fileName) => {
  if (!fileName) return 'Lainnya'
  const ext = fileName.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'Gambar'
  if (ext === 'pdf') return 'PDF'
  return 'Lainnya'
}

// Chart Data: File berdasarkan jenis
const templateByJenis = computed(() => {
  const map = {}
  for (const f of listFiles.value) {
    const jenis = getFileType(f.file_name)
    if (!map[jenis]) map[jenis] = 0
    map[jenis]++
  }
  
  // Warna untuk chart
  const warna = ['#22c1c3', '#0f4ba0', '#377dff', '#4ade80', '#facc15']
  
  return Object.entries(map).map(([jenis, jumlah], idx) => ({
    jenis,
    jumlah,
    color: warna[idx % warna.length]
  }))
})

// Donut Style
const donutTemplateStyle = computed(() => {
  if (!templateByJenis.value.length) {
    return { background: '#e5e7eb' }
  }
  const total = templateByJenis.value.reduce((s, t) => s + t.jumlah, 0) || 1
  let start = 0
  const segments = templateByJenis.value.map((t) => {
    const percent = (t.jumlah / total) * 100
    const end = start + percent
    const seg = `${t.color} ${start}% ${end}%`
    start = end
    return seg
  })
  return {
    background: `conic-gradient(${segments.join(', ')})`
  }
})

/* ================= STATISTIK MAHASISWA (PRODI) ================= */

const mahasiswaByProdiWithPercent = computed(() => {
  const map = {}
  for (const m of listMahasiswa.value) {
    const prodi = m.prodi || 'Tanpa Prodi'
    if (!map[prodi]) map[prodi] = 0
    map[prodi]++
  }

  const rows = Object.entries(map).map(([prodi, jumlah]) => ({
    prodi,
    jumlah
  }))

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

onMounted(() => {
  fetchSummary()
})

/* ================= KOMPONEN KARTU ================= */
const StatCard = {
  props: {
    title: String,
    subtitle: String,
    value: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    formattedValue() {
      if (this.value == null) return '0'
      return new Intl.NumberFormat('id-ID').format(this.value)
    }
  },
  template: `
    <div class="bg-white rounded-[24px] shadow-[0_10px_24px_rgba(0,0,0,0.15)] px-4 py-4">
      <p class="text-[11px] font-semibold tracking-wide text-gray-600">TOTAL</p>
      <p class="text-3xl font-extrabold text-[#2366d1] leading-tight mt-1">
        {{ formattedValue }}
      </p>
      <p class="text-[11px] font-semibold tracking-wide text-gray-700 mt-1 uppercase">
        {{ subtitle }}
      </p>
    </div>
  `
}
</script>

<style scoped>
</style>