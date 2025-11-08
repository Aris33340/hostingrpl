<template>
    <div class="min-h-screen p-4 md:p-6 lg:p-8">
        <div class="mb-6">
            <h1 class="text-2xl md:text-3xl font-bold text-white">Dashboard Petugas Scanner</h1>
            <p class="text-white text-sm md:text-base mt-1">Kelola presensi wisudawan secara realtime</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InfoContainer :value="totalUndangan" message="Total Undangan" icon="users" color="blue" />
            <InfoContainer :value="totalHadir" message="Hadir" icon="check" color="green" />
            <InfoContainer :value="totalBelumHadir" message="Belum Hadir" icon="clock" color="orange" />
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
                        <input v-model="searchQuery" type="text" placeholder="Cari berdasarkan NIM atau Nama..."
                            class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl  focus:border-blue-500 focus:ring-2 backdrop-blur-lg bg-transparent focus:ring-blue-200 transition-all outline-none" />
                    </div>
                </div>

                <select v-model="filterJurusan"
                    class="px-4 py-2.5 border-2 border-gray-200 focus:text-gray-800  rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none backdrop-blur-lg bg-transparent">
                    <option value="">Semua Jurusan</option>
                    <option value="ti">Teknik Informatika</option>
                    <option value="si">Sistem Informasi</option>
                </select>

                <select v-model="filterProdi"
                    class="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:text-gray-800  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none backdrop-blur-lg bg-transparent">
                    <option value="">Semua Prodi</option>
                    <option value="d3">D3</option>
                    <option value="d4">D4</option>
                </select>
            </div>

            <div v-if="viewMode === 'table'" class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-50 border-b-2 border-gray-200">
                            <th @click="sortBy('nim')"
                                class="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div class="flex items-center gap-2">
                                    NIM
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                            </th>
                            <th @click="sortBy('nama')"
                                class="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer transition-colors">
                                <div class="flex items-center gap-2">
                                    Nama
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                            </th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jurusan</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prodi</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedData" :key="index"
                            class="border-b border-gray-100 hover:border-blue-400 hover:cursor-pointer transition-colors">
                            <td class="px-4 py-3 text-sm font-bold text-white">{{ item.nim }}</td>
                            <td class="px-4 py-3 text-sm font-bold text-white">{{ item.nama }}</td>
                            <td class="px-4 py-3 text-sm text-gray-300">{{ item.jurusan }}</td>
                            <td class="px-4 py-3 text-sm text-gray-300">{{ item.prodi }}</td>
                            <td class="px-4 py-3">
                                <span
                                    :class="item.status === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
                                    class="icon-status px-3 py-1 rounded-full text-xs font-semibold">
                                    {{ item.status === 'hadir' ? '✓ Hadir' : '○ Belum' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-300">{{ item.waktu || '-' }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
                    <div class="text-sm text-white">
                        Menampilkan {{ startIndex + 1 }} - {{ endIndex }} dari {{ filteredData.length }} data
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
                        <svg class="w-64 h-64" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" stroke-width="20" />
                            <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="20"
                                :stroke-dasharray="`${(totalHadir / totalUndangan * 502.4)} 502.4`"
                                transform="rotate(-90 100 100)" class="transition-all duration-1000" />
                            <text x="100" y="95" text-anchor="middle" class="text-3xl font-bold fill-gray-800">
                                {{ Math.round(totalHadir / totalUndangan * 100) }}%
                            </text>
                            <text x="100" y="115" text-anchor="middle" class="text-sm fill-gray-600">
                                Kehadiran
                            </text>
                        </svg>
                    </div>
                    <div class="mt-8 flex justify-center gap-8">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span class="text-sm font-medium text-gray-700">Hadir: {{ totalHadir }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 bg-gray-300 rounded-full"></div>
                            <span class="text-sm font-medium text-gray-700">Belum: {{ totalBelumHadir }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InfoContainer from '../components/InfoContainer.vue';
import Scanner from '../components/Scanner.vue';
import api from '@/api'
import { useModal } from '../composables/useModal';
import { showNotification } from '../composables/useNotification'

const modal = useModal();
const BASE_URL = 'api/'
const scannerRef = ref(null)
const scanResult = ref("");

const handleScan = async (value) => {
    scanResult.value = value;
    try {
        const res = await api.post(`${BASE_URL}scan`, { qr: String(scanResult.value) });
        const data = res.data.data;
        let nama;
        if (data.jenis == "mahasiswa") {
            nama = data.mahasiswa.nama;
            const result = await modal.open({
                title: 'Konfirmasi Kehadiran',
                message: `Tandai ${nama} sebagai hadir?`,
                type: 'question'
            })

            if (!result) {
                modal.close(true);
            }

        } else {
            nama = data.tamu.nama;
            const result = await modal.open({
                title: 'Konfirmasi Kehadiran',
                message: `Tandai Bapak/Ibu ${nama} sebagai hadir?`,
                type: 'question'
            })
            if (!result) {
                modal.close(true);
            }

        }
        const response = await api.patch(`${BASE_URL}scan/${data.presensis[0].id_presensi}`, { status: 1 })

        setTimeout(() => {
            modal.open({
                title: 'Berhasil!',
                message: `Hadirin atas nama ${nama} ditandai hadir`,
                type: 'success'
            })
        }, 3000)
    } catch (error) {
        showNotification('error', ': ' + (error.response?.data?.message || error.message))
    }
    modal.close(true)

}

function pauseScan() {
    scannerRef.value?.pauseScanner()
}

function resumeScan() {
    scannerRef.value?.resumeScanner()
}


</script>