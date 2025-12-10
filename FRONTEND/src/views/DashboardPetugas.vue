<template>
    <div class="min-h-screen mx-10 md:p-6 lg:p-8">
        <div class="flex md:flex-col flex-col">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 order-2 md:order-1">
                <InfoContainer :loading="isLoading" :value="totalUndangan" message="Total Undangan" icon="users"
                    color="blue" />
                <InfoContainer :loading="isLoading" :value="totalHadir" message="Hadir" icon="check" color="green" />
                <InfoContainer :loading="isLoading" :value="totalBelumHadir" message="Belum Hadir" icon="clock"
                    color="orange" />
            </div>

            <div class="grid h-full grid-cols-1 lg:grid-cols-2 gap-6 mb-6 order-1 md:order-2">
                <div class="bg-white/5 border border-blue-500/20 rounded-2xl">
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

                    <div class="flex flex-col justify-center h-full p-6">
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">NIM Wisudawan</label>
                            <input v-model="manualNim" type="text" placeholder="Contoh: 222011234"
                                class="w-full px-4 py-3 border-2 mb-4 bg-transparent border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" />
                            <button @click="handleManualInput" :disabled="!manualNim"
                                class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                Tandai Hadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div class="flex flex-col">
                    <h2 class="text-xl font-bold text-white">Manajemen Data Kehadiran</h2>
                    <KategoriToggle v-show="viewMode === 'table'" @change="handleKategoriToggle" />
                </div>
                <!-- button grafik -->
                <div
                    class="flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-2">
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

            <div v-show="viewMode === 'table'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                <div v-if="isMahasiswa" class="md:col-span-2">
                    <select v-model="selectedPeminatan"
                        class="px-4 py-2.5 border-2 w-1/2 border-gray-200 cursor-pointer rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none backdrop-blur-lg bg-transparent">
                        <option class="text-gray-700" value="">-- Pilih Peminatan --</option>
                        <option class="text-gray-700" v-for="p in peminatans" :key="p.kode" :value="p">{{ p.label
                            }}</option>
                    </select>
                    <select v-model="selectedKelas"
                        class="px-4 py-2.5 border-2 w-1/2 cursor-pointer border-gray-200 rounded-xl  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none backdrop-blur-lg bg-transparent"
                        :disabled="!selectedPeminatan">
                        <option class="text-gray-700" value="">-- Pilih Kelas --</option>
                        <option class="text-gray-700" v-for="k in filteredKelas" :key="k.kode" :value="k">{{
                            k.label }}</option>
                    </select>
                </div>

            </div>

            <div v-if="viewMode === 'table'" class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-50 border-b-2 border-gray-200">
                            <th v-for="value in tableKey.slice(0, tableKey.length - 3)" @click="sortBy(value)"
                                class="px-4 py-3 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div class="flex justify-center items-center gap-2">
                                    {{ value }}
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                            </th>

                            <th @click="toggleStatusFilter"
                                class="px-4 py-3 text-center text-sm font-semibold bg-blue-200 text-gray-700 cursor-pointer hover:bg-blue-100 transition-colors">
                                {{
                                    filterStatus === 0
                                        ? 'Belum Hadir'
                                        : filterStatus === 1
                                            ? 'Hadir'
                                            : 'Status'
                                }} </th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableDataAll" :key="index"
                            class="border-b border-gray-100 hover:border-blue-400 hover:cursor-pointer transition-colors">
                            <td v-for="value in tableKey.slice(0, tableKey.length - 3)"
                                class="px-4 py-3 text-sm font-bold text-white">{{ item[`${value}`] }}</td>

                            <td class="px-4 py-3">
                                <span @click="canToggleStatus ? toggleStatus(item) : null" :class="[
                                    'icon-status px-3 py-1 rounded-full text-xs font-semibold cursor-pointer',
                                    item.status === 1
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700',
                                    canToggleStatus ? 'hover:opacity-70' : 'cursor-not-allowed'
                                ]">
                                    {{ item.status === 1 ? '✓ Hadir' : '○ Belum' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-300">{{ new
                                Date(item.waktu).toLocaleTimeString([], {
                                    hour:
                                        '2-digit', minute: '2-digit'
                                }) || '-' }}</td>
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
                <div class="flex flex-col  w-full h-full">

                    <div class="flex flex-row">
                        <GrafikLingkaran :labels="['Mahasiswa', 'Non Mahasiswa']" :values="pieChartData"
                            :key="pieChartData" />
                        <GrafikBatangVertikalPersentase :labels="['Mahasiswa', 'Non Mahasiswa']" :values="yBarChartData"
                            :key="yBarChartData" />
                    </div>

                    <GrafikBatangHorizontal :labels="xBarChartData.map(e => String(Object.keys(e)))" :values="xBarChartData.map(e => {
                        return Math.ceil(e[Object.keys(e).toString()].hadir / e[Object.keys(e).toString()].total * 100)
                    })" :key="xBarChartData" />
                    <GrafikBatangVertikalTotal :labels="xBarChartData.map(e => String(Object.keys(e)))" :values="xBarChartData.map(e => {
                        return e[Object.keys(e).toString()].total
                    })" :key="yBarChartData" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import InfoContainer from '../components/InfoContainer.vue';
import GrafikBatangVertikalPersentase from "../components/DashboardPetugas/GrafikBatangVertikalPersentase.vue";
import GrafikBatangVertikalTotal from "../components/DashboardPetugas/GrafikBatangVertikalTotal.vue";
import GrafikBatangHorizontal from "../components/DashboardPetugas/GrafikBatangHorizontal.vue";
import GrafikLingkaran from "../components/DashboardPetugas/GrafikLingkaran.vue";
import Scanner from '../components/QrScanner.vue';
import KategoriToggle from '../components/DashboardPetugas/KategoriButton.vue';
import { mainApi } from '@/api'
import { useModal } from '../composables/useModal';
import { showNotification } from '../composables/useNotification'
import { useAuthStore } from '../stores/authStore';
const modal = useModal();
const scannerRef = ref(null)
const manualNim = ref('');
const scanResult = ref("");
const statistikData = ref();
const totalUndangan = computed(() => isMahasiswa.value ? statistikData.value?.totalUndanganMahasiswa ?? 0 : statistikData.value?.totalUndanganTamu ?? 0)
const totalHadir = computed(() => isMahasiswa.value ? statistikData.value?.mahasiswaHadir ?? 0 : statistikData.value?.tamuHadir ?? 0)
const totalBelumHadir = computed(() => isMahasiswa.value ? statistikData.value?.mahasiswaTidakHadir ?? 0 : statistikData.value?.tamuTidakHadir ?? 0);
const tableDataAll = ref([])
const isLoading = ref(true);
const viewMode = ref('chart');
const searchQuery = ref('');
const filterKelas = ref('');
const filterProdi = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalData = ref(0);
const tableMode = ref()
const filterStatus = ref(null);
const totalPages = computed(() => Math.ceil(totalData.value / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalData.value));
const tableKey = ref([])
const sortState = ref({});
const isMahasiswa = ref(true)
const authStore = useAuthStore()
const pieChartData = ref([1, 1])
const xBarChartData = ref([])
const yBarChartData = ref([])
const peminatans = ref([{ kode: '01', label: "KS" }, { kode: '02', label: "ST" }, { kode: '03', label: "D3" }])
const kelas = ref([
    { kode: '0101', label: "4SI1" }, { kode: '0102', label: "4SI2" },
    { kode: '0103', label: "4SD1" }, { kode: '0104', label: "4SD2" },
    { kode: '0201', label: "4SE1" }, { kode: '0202', label: "4SE2" },
    { kode: '0203', label: "4SK1" }, { kode: '0204', label: "4SK2" },
    { kode: '0301', label: "3D31" }, { kode: '0302', label: "3D32" },
])
const selectedPeminatan = ref('')
const selectedKelas = ref('')
const filteredKelas = computed(() => {
    if (!selectedPeminatan.value) return []
    return kelas.value.filter(k => k.kode.startsWith(selectedPeminatan.value.kode))
})
let payload = null

watch(() => ([selectedPeminatan.value, selectedKelas.value]), async () => {
    await mountTableData(isMahasiswa.value)
})

watch(selectedPeminatan, async (newVal, oldVal) => {
    if (newVal !== oldVal && selectedKelas.value) {
        selectedKelas.value = ''
    }
    await mountTableData(isMahasiswa.value)
})

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
    });
}

async function showConfirm(name) {
    return Swal.fire({
        title: "Konfirmasi Kehadiran",
        text: `Konfirmasi Kehadiran Peserta ${name} ?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Konfirmasi",
        cancelButtonText: "Batal"
    }).then((result) => {
        return result.isConfirmed;
    });
}

const mountTableData = async (type) => {
    console.log('peminatan:', selectedPeminatan.value.label)
    console.log('kelas:', selectedKelas.value.label)
    await mountStatistikData()
    isLoading.value = true;
    try {
        let res;
        if (type) {
            res = await mainApi.get(`mahasiswa/pagination`, {
                params: {
                    search: searchQuery.value || undefined,
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    status: filterStatus.value !== null ? filterStatus.value : undefined,
                    peminatan: selectedPeminatan.value.label,
                    kelas: selectedKelas.value.label
                }
            });
            console.log("data tabel", res.data)
            tableDataAll.value = res.data.data.map(e => {
                const presensi = e.peserta[0]?.presensis ?? []
                const restructuredData = {
                    nim: e.nim,
                    nama: e.nama,
                    kelas: e.kelas,
                    prodi: e.prodi,
                    id_presensi: presensi[0]?.id_presensi,
                    status: presensi[0]?.status,
                    waktu: presensi[0]?.waktu_presensi,
                }
                return restructuredData
            })
        } else {
            res = await mainApi.get('tamu/pagination', {
                params: {
                    search: searchQuery.value || undefined,
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    status: filterStatus.value !== null ? filterStatus.value : undefined,
                }
            })
            tableDataAll.value = res.data.data.map(e => {
                const presensi = e.peserta[0]?.presensis ?? []
                const restructuredData = {
                    nama: e.nama,
                    asal_instansi: e.asal_instansi,
                    id_presensi: presensi[0]?.id_presensi,
                    status: presensi[0]?.status,
                    waktu: presensi[0]?.waktu_presensi,
                }
                return restructuredData
            })
        }
        tableKey.value = Object.keys(tableDataAll.value[0])
        tableKey.value.forEach(key => {
            sortState.value[key] = false;
        });
        totalData.value = res.data.total
    } catch (e) {
        console.log(e)
        showNotification('error', e.message || 'Gagal memuat data mahasiswa');
    } finally {
        isLoading.value = false;
    }
};

async function mountStatistikData() {
    isLoading.value = true
    try {
        const res = await mainApi.get(`presensi/statistik-data`);
        const data = res.data;
        statistikData.value = data;
        pieChartData.value = [
            statistikData.value?.totalUndanganMahasiswa ?? 0,
            statistikData.value?.totalUndanganTamu ?? 0
        ]
        xBarChartData.value = statistikData.value?.peminatan
        yBarChartData.value = [
            Math.ceil(statistikData.value?.mahasiswaHadir / statistikData.value?.totalUndanganMahasiswa * 100),
            Math.ceil(statistikData.value?.tamuHadir / statistikData.value?.totalUndanganTamu * 100)
        ]

        console.log(xBarChartData.value.map(e => {
            return e[Object.keys(e).toString()].total
        }))
    } catch (e) {
        showNotification('error', e.message);
    } finally {
        isLoading.value = false;
    }
}


function toggleStatusFilter() {
    if (filterStatus.value === null) filterStatus.value = 1;   // tampilkan hadir
    else if (filterStatus.value === 1) filterStatus.value = 0; // tampilkan belum
    else filterStatus.value = null;                            // kembali ke semua
    mountTableData(isMahasiswa.value); // refresh data
}

const handleKategoriToggle = async (event) => {
    currentPage.value = 1
    isMahasiswa.value = event
    await mountTableData(event)
}

function sortBy(key) {
    sortState.value[key] = !sortState.value[key];
    const isAsc = sortState.value[key];
    tableDataAll.value.sort((a, b) => {
        return isAsc ? String(a[`${key}`]).localeCompare(b[`${key}`]) : String(b[`${key}`]).localeCompare(a[`${key}`])
    })
}


try {
    payload = authStore.getPayload()
} catch (err) {
    payload = null
    console.warn("JWT tidak valid atau belum login")
}
const canToggleStatus = computed(() => {
    if (!payload) return false
    return payload.role === 'SUPERADMIN' || payload.role === 'SEKRETARIAT'
})

const toggleStatus = async (presensi) => {
    if (!presensi) return
    const id = presensi.id_presensi
    const current = presensi.status

    try {
        if (current === 1) {
            await mainApi.patch(`presensi/unmark-status/${id}`)
            presensi.status = 0
        } else {
            await mainApi.patch(`presensi/mark-status/${id}`)
            presensi.status = 1
        }
    } catch (err) {
        console.error(err)
    }
    await mountTableData(isMahasiswa.value)
}

const visiblePages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const handlePresensi = async (idPresensi) => {
    try {
        const resPesertaData = await mainApi.get(`presensi/find-peserta/${Number(idPresensi)}`);
        const pesertaData = resPesertaData.data;
        const nama = pesertaData.peserta.mahasiswa ? pesertaData.peserta.mahasiswa.nama : pesertaData.peserta.tamu.nama
        if (!pesertaData.peserta) {
            showNotification('error', 'Data tidak ditemukan');
        } else {
            if (pesertaData.status == 1) {
                const title = "Sudah Hadir"
                const text = `${nama} Sudah Ditandai Hadir !`
                const icon = "error"
                return showAlert(title, text, icon)
            }
            const modalres = await showConfirm(pesertaData.peserta.mahasiswa ? pesertaData.peserta.mahasiswa.nama : pesertaData.peserta.tamu.nama)

            if (modalres) {
                const res = await mainApi.patch(`presensi/mark-status/${Number(idPresensi)}`)
                await mountTableData(isMahasiswa.value);
                const title = "Sukses"
                const text = `${nama} berhasil ditandai hadir!`
                const icon = 'success'
                return showAlert(title, text, icon)
            } else {
                const title = 'Dibatalkan'
                const text = `${nama} dibatalkan`
                const icon = 'info'
                return showAlert(title, text, icon)
            }
        }

    } catch (error) {
        showNotification('error', error.response.data.message);
    }
}

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
        const res = await mainApi.get(`presensi/find-nim/${manualNim.value}`);
        await handlePresensi(res.data[0].id_presensi);
    } catch (error) {
        const title = 'Not Found'
        const text = 'NIM tidak ditemukan'
        const icon = 'error'
        showAlert(title, text, icon)
    }
};

function pauseScan() {
    scannerRef.value?.pauseScanner()
}

function resumeScan() {
    scannerRef.value?.resumeScanner()
}
const stopCamera = () => {
    scannerRef.value?.stopScanner(); // PENTING
};
watch([searchQuery, currentPage, itemsPerPage], async () => {
    await mountTableData(isMahasiswa.value);
});

onMounted(async () => {
    await mountTableData(isMahasiswa.value);
});

onBeforeUnmount(() => {
    stopCamera()
})
</script>