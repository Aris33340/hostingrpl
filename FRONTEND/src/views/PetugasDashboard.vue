<template>
    <div class="min-h-screen p-4 md:p-6 lg:p-8">
        <div class="mb-6">
            <h1 class="text-2xl md:text-3xl font-bold text-white">Dashboard Petugas Scanner</h1>
            <p class="text-white text-sm md:text-base mt-1">Kelola presensi wisudawan secara realtime</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InfoContainer :loading="isLoading" :value="totalUndangan" message="Total Undangan" icon="users"
                color="blue" />
            <InfoContainer :loading="isLoading" :value="totalHadir" message="Hadir" icon="check" color="green" />
            <InfoContainer :loading="isLoading" :value="totalBelumHadir" message="Belum Hadir" icon="clock"
                color="orange" />
        </div>

        <div class="grid h-full grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20">
                <Scanner ref="scannerRef" @scanned="handleScan" />
            </div>

            <div class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
                <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Input Manual
                </h2>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">NIM Wisudawan</label>
                        <input v-model="manualNim" type="text" placeholder="Contoh: 222011234"
                            class="w-full px-4 py-3 border-2 bg-transparent border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" />
                    </div>
                    <button @click="handleManualInput" :disabled="!manualNim"
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        Tandai Hadir
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 class="text-xl font-bold text-white">Manajemen Data Kehadiran</h2>

                <div
                    class="flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-2  ">
                    <button @click="viewMode = 'table'"
                        :class="viewMode === 'table' ? 'border-blue-500 text-blue-400' : 'text-white'"
                        class="px-4 py-2 rounded-md transition-all font-medium text-sm hover:text-blue-600 hover:border-b-blue-700">
                        <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Tabel
                    </button>
                    <button @click="viewMode = 'chart'"
                        :class="viewMode === 'chart' ? 'border-blue-500 text-blue-400' : 'text-white'"
                        class="px-4 py-2 rounded-md transition-all font-medium text-sm hover:text-blue-600 hover:border-b-blue-700">
                        <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        Grafik
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="md:col-span-2">
                    <div class="relative">
                        <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input v-model="searchQuery" @onchange="mountTableData" type="text"
                            placeholder="Cari berdasarkan NIM atau Nama..."
                            class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl  focus:border-blue-500 focus:ring-2 backdrop-blur-lg bg-transparent focus:ring-blue-200 transition-all outline-none" />
                    </div>
                </div>

                <select v-model="filterKelas"
                    class="px-4 py-2.5 border-2 border-gray-200 cursor-pointer rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none backdrop-blur-lg bg-transparent">
                    <option class="text-gray-700" value="">Semua Kelas</option>
                    <option class="text-gray-700" value="SD">Sains Data</option>
                    <option class="text-gray-700" value="SI">Sistem Informasi</option>
                    <option class="text-gray-700" value="SK">Statistik Sosial Kependudukan</option>
                    <option class="text-gray-700" value="SE">Statistik Ekonomi</option>
                    <option class="text-gray-700" value="D3">D3 Statistika</option>
                </select>

                <select v-model="filterProdi"
                    class="px-4 py-2.5 border-2 cursor-pointer border-gray-200 rounded-xl  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none backdrop-blur-lg bg-transparent">
                    <option class="text-gray-700" value="">Semua Prodi</option>
                    <option class="text-gray-700" value="d3">D3</option>
                    <option class="text-gray-700" value="d4st">D4ST</option>
                    <option class="text-gray-700" value="d4ks">D4KS</option>
                </select>
            </div>

            <div v-if="viewMode === 'table'" class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-50 border-b-2 border-gray-200">
                            <th @click="sortBy('nim')"
                                class="px-4 py-3 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div class="flex justify-center items-center gap-2">
                                    NIM
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                            </th>
                            <th @click="sortBy('nama')"
                                class="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer transition-colors">
                                <div class="flex justify-center items-center gap-2">
                                    Nama
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                            </th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Kelas</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Prodi</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedData" :key="index"
                            class="border-b border-gray-100 hover:border-blue-400 hover:cursor-pointer transition-colors">
                            <td class="px-4 py-3 text-sm font-bold text-white">{{ item.nim }}</td>
                            <td class="px-4 py-3 text-sm font-bold text-white">{{ item.nama }}</td>
                            <td class="px-4 py-3 text-sm text-gray-300">{{ item.kelas }}</td>
                            <td class="px-4 py-3 text-sm text-gray-300">{{ item.prodi }}</td>
                            <td class="px-4 py-3">
                                <span
                                    :class="item.peserta[0]?.presensis[0]?.status === 1 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
                                    class="icon-status px-3 py-1 rounded-full text-xs font-semibold">
                                    {{ item.peserta[0]?.presensis[0]?.status === 1 ? '✓ Hadir' : '○ Belum' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-300">{{ item.waktu || '-' }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
                    <div class="text-sm text-white">
                        Menampilkan {{ startIndex + 1 }} - {{ endIndex }} dari {{ totalData }} data
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="currentPage--" :disabled="currentPage === 1"
                            class="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            Prev
                        </button>
                        <div class="flex gap-2">
                            <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                                :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
                                class="px-4 py-2 border-2 rounded-lg transition-all font-medium">
                                {{ page }}
                            </button>
                        </div>
                        <button @click="currentPage++" :disabled="currentPage === totalPages"
                            class="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="flex justify-center items-center py-12">
                <div class="text-center">
                    <div class="relative inline-block">
                        <div class="absolute inset-0 blur-2xl opacity-30">
                            <div class="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></div>
                        </div>

                        <svg class="w-64 h-64 relative z-10 transform hover:scale-105 transition-transform duration-500"
                            viewBox="0 0 200 200">
                            <defs>
                                <linearGradient id="pieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                                </linearGradient>
                                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
                                </linearGradient>

                                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                    <feOffset dx="0" dy="2" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.3" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#bgGradient)" stroke-width="24"
                                opacity="0.5" />

                            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#pieGradient)" stroke-width="24"
                                stroke-linecap="round"
                                :stroke-dasharray="`${(totalHadir / totalUndangan * 502.4)} 502.4`"
                                transform="rotate(-90 100 100)" class="transition-all duration-[2000ms] ease-out"
                                filter="url(#shadow)" style="transition-delay: 200ms" />
                            <circle cx="100" cy="100" r="65" fill="white" opacity="0.95" />

                            <text x="100" y="92" text-anchor="middle"
                                class="text-5xl font-bold fill-transparent animate-pulse" style="background: linear-gradient(135deg, #10b981, #059669); 
                           -webkit-background-clip: text;
                           background-clip: text;">
                                <tspan class="fill-emerald-600">
                                    {{ Math.round(totalHadir / totalUndangan * 100) }}
                                </tspan>
                                <tspan class="text-3xl fill-emerald-500">%</tspan>
                            </text>

                            <text x="100" y="118" text-anchor="middle"
                                class="text-sm font-semibold fill-gray-500 tracking-wider uppercase">
                                Kehadiran
                            </text>
                        </svg>
                    </div>

                    <div class="mt-10 flex justify-center gap-6">
                        <div class="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 
                        rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl 
                        transition-all duration-300 hover:-translate-y-1 border border-emerald-100">
                            <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-400 rounded-full 
                            opacity-10 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                            <div class="relative flex items-center gap-3">
                                <div class="flex items-center justify-center w-10 h-10 
                                bg-gradient-to-br from-emerald-500 to-teal-500 
                                rounded-xl shadow-lg">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <div class="text-left">
                                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hadir</p>
                                    <p class="text-2xl font-bold text-emerald-600">{{ totalHadir }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 
                        rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl 
                        transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                            <div class="absolute top-0 right-0 w-20 h-20 bg-gray-400 rounded-full 
                            opacity-10 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                            <div class="relative flex items-center gap-3">
                                <div class="flex items-center justify-center w-10 h-10 
                                bg-gradient-to-br from-gray-400 to-slate-400 
                                rounded-xl shadow-lg">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div class="text-left">
                                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Belum</p>
                                    <p class="text-2xl font-bold text-gray-600">{{ totalBelumHadir }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 
                    bg-gradient-to-r from-gray-100 to-slate-100 
                    rounded-full border border-gray-200">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        <span class="text-sm font-medium text-gray-600">
                            Total Undangan: <span class="font-bold text-gray-800">{{ totalUndangan }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import InfoContainer from '../components/InfoContainer.vue';
import Scanner from '../components/QrScanner.vue';
import { mainApi } from '@/api'
import { useModal } from '../composables/useModal';
import { showNotification } from '../composables/useNotification'

const modal = useModal();
const scannerRef = ref(null)
const manualNim = ref('');
const scanResult = ref("");
const totalUndangan = ref(0);
const totalHadir = ref(0);
const totalBelumHadir = ref(0);
const isLoading = ref(true);
const viewMode = ref('table');
const tableData = ref([]);
const searchQuery = ref('');
const filterKelas = ref('');
const filterProdi = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalData = ref(0);

// total halaman dari server
const totalPages = computed(() => Math.ceil(totalData.value / itemsPerPage.value));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalData.value));

/* ===========================================
   🔹 Ambil data mahasiswa (pagination + search)
   =========================================== */
const mountTableData = async () => {
    try {
        isLoading.value = true;
        const res = await mainApi.get(`mahasiswa/pagination`, {
            params: {
                search: searchQuery.value || undefined,
                page: currentPage.value,
                limit: itemsPerPage.value
            }
        });

        tableData.value = res.data.data || [];
        totalData.value = res.data.total || tableData.value.length;
    } catch (e) {
        showNotification('error', e.message || 'Gagal memuat data mahasiswa');
    } finally {
        isLoading.value = false;
    }
};


async function mountStatistikData() {
    try {
        const res = await mainApi.get(`presensi/count-status-presensi`);
        const d = res.data;
        totalUndangan.value = d.totalUndangan;
        totalHadir.value = d.totalUndanganHadir;
        totalBelumHadir.value = d.totalUndanganTidakHadir;
    } catch (e) {
        showNotification('error', e.message);
    } finally {
        isLoading.value = false;
    }
}


const filteredData = computed(() => {
    return tableData.value.filter(item => {
        const matchSearch =
            String(item.nim)?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.nama?.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchKelas = !filterKelas.value || item.kelas?.toLowerCase() === filterKelas.value.toLowerCase();
        const matchProdi = !filterProdi.value || item.prodi?.toLowerCase() === filterProdi.value.toLowerCase();
        return matchSearch && matchKelas && matchProdi;
    });
});

const paginatedData = computed(() => filteredData.value);


watch([searchQuery, currentPage, itemsPerPage], async () => {
    await mountTableData();
});

onMounted(async () => {
    await mountTableData();
    await mountStatistikData();
});


const handleScan = async (value) => {
    try {
        const resScan = await mainApi.post('scan', { data: value });
        scanResult.value = resScan.data.hasilDecrypt;
        handlePresensi(scanResult.value);
    } catch (error) {
        showNotification('error', error.message);
    }
    finally {
        setTimeout(() => resumeScan(), 2000);
    }
}

const handleManualInput = async () => {
    try {
        const res = await mainApi.get(`presensi/find-nim/${manualNim.value}`)
        handlePresensi(res.data.id_presensi);
    } catch (error) {
        console.log(error.message);

    }
};

const handlePresensi = async (idPresensi) => {
    try {
        const resPesertaData = await mainApi.get(`presensi/find-peserta/${idPresensi}`);
        const pesertaData = resPesertaData.data;
        if (!pesertaData.peserta) {
            showNotification('error', 'Data tidak ditemukan');
        } else {
            const modalres = await modal.open({
                title: "Konfirmasi Kehadiran?",
                message: `Konfirmasi Kehadiran ${pesertaData.peserta.mahasiswa ? pesertaData.peserta.mahasiswa.nama : pesertaData.peserta.tamu.nama}`,
                type: 'question'
            })

            if (modalres) {
                const res = await mainApi.patch(`presensi/mark-status/${Number(idPresensi)}`)
                await mountStatistikData();
                await mountTableData();
                showNotification(res.data.STATUS_CODES === 200 ? 'success' : 'error', res.data.message)

            } else {
                showNotification('success', "Presensi dibatalkan")
            }
        }

    } catch (error) {
        showNotification('error', error.message);
    }
}

function pauseScan() {
    scannerRef.value?.pauseScanner()
}

function resumeScan() {
    scannerRef.value?.resumeScanner()
}
</script>