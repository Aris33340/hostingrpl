<template>
  <!-- LAYER 1: Warna custom -->
  <div class="min-h-screen bg-cover bg-center bg-no-repeat rgb-custom">

    <!-- LAYER 2: Overlay transparan -->
    <div class="min-h-screen bg-blue-900/40 flex">

      <!-- KONTEN UTAMA -->
      <main class="flex-1 p-8">
        <div class="max-w-7xl mx-auto">

          <!-- HEADER -->
          <header class="mb-8 text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-white">
              📚 Manajemen Undangan
            </h2>
            <p class="text-blue-200/70 mt-1 text-sm">
              Dashboard Admin • Kelola pengiriman undangan
            </p>
          </header>

          <!-- CARD UTAMA -->
          <section class="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-6 py-5">

            <!-- BUTTON BAR -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div class="flex items-center gap-2">
                <button
                  class="px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  @click="openTypeModal"
                >
                  + Surel
                </button>

                <button
                  class="px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-md"
                  @click="showAddAccount = true"
                >
                  + Add Account
                </button>

                <button
                  class="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-300 text-blue-900 hover:bg-yellow-400 shadow-md"
                  @click="openGenerateQr"
                >
                  Generate Hash QR Presensi
                </button>
              </div>

              <!-- SEARCH -->
              <div class="flex items-center gap-2">
                <div class="relative">
                  <input
                    v-model="searchTerm"
                    type="text"
                    placeholder="Cari Surel"
                    class="pl-9 pr-3 py-1.5 rounded-full border border-gray-300 text-sm w-56"
                  />
                  <span class="absolute left-2.5 top-1.5 text-gray-400 text-sm">🔍</span>
                </div>
                <button
                  class="px-3 py-1.5 text-xs rounded-full border border-gray-300 hover:bg-gray-50"
                  @click="loadLogs"
                >
                  Refresh
                </button>
              </div>
            </div>

            <!-- LIST EMAIL -->
            <div class="border rounded-2xl overflow-hidden bg-white/60">
              <div
                v-if="filteredLogs.length === 0"
                class="py-6 text-center text-xs text-gray-500"
              >
                Belum ada riwayat pengiriman surel.
              </div>

              <div
                v-for="log in filteredLogs"
                :key="log.id_sendStatus"
                class="flex items-start justify-between px-5 py-3 border-b bg-white hover:bg-gray-100 transition text-sm"
              >
                <div class="flex flex-col text-left w-full">
                  <span class="font-semibold text-gray-900">{{ log.subject || "Surel" }}</span>
                  <span class="text-gray-600 text-xs">{{ log.recipient_email }}</span>

                  <span class="text-gray-400 text-[11px] mt-1">
                    {{ formatDatetime(log.waktu_dikirim) }}
                    <span v-if="log.error_message" class="text-red-500">
                      • {{ log.error_message }}
                    </span>
                  </span>
                </div>

                <div class="flex items-center pl-3">
                  <span
                    v-if="log.status === 1"
                    class="text-green-600 text-lg font-bold"
                  >✔</span>

                  <button
                    v-else
                    class="text-red-600 text-lg font-bold"
                    @click="retry(log)"
                  >✖</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- MODALS -->
      <AddEmailAccountModal v-if="showAddAccount" @close="showAddAccount = false" />

      <!-- MODAL PILIHAN JENIS UNDANGAN -->
      <div v-if="showTypeModal" class="modal-overlay" @click.self="closeTypeModal">
        <div class="modal-content">
          <h3>Pilih Jenis Undangan</h3>

          <button class="modal-btn mhs" @click="goToMahasiswa">
            🎓 Kirim Undangan Mahasiswa
          </button>

          <button class="modal-btn tamu" @click="goToTamu">
            🧑‍🤝‍🧑 Kirim Undangan Tamu
          </button>

          <button class="modal-close" @click="closeTypeModal">Tutup</button>
        </div>
      </div>

      <!-- MODAL QR -->
      <transition name="fade">
        <div v-if="showGenerateQr" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-xl w-80 p-6 text-black">
            <h3 class="text-lg font-semibold mb-2 text-center">
              Generate Hash QR Presensi
            </h3>

            <input
              v-model="qrKey"
              type="text"
              placeholder="contoh: 1234"
              class="w-full border rounded-full px-3 py-1.5 text-sm mb-3"
            />

            <div class="flex justify-end gap-2">
              <button class="px-3 py-1.5 text-xs rounded-full border" @click="closeGenerateQr">Batal</button>
              <button class="px-4 py-1.5 text-xs rounded-full bg-blue-600 text-white" @click="submitGenerateQr">
                Simpan Key
              </button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

import AddEmailAccountModal from "../components/AddEmailAccountModal.vue";

const router = useRouter();

/* STATE */
const logs = ref<any[]>([]);
const searchTerm = ref("");

const showTypeModal = ref(false);
const showAddAccount = ref(false);

const showGenerateQr = ref(false);
const qrKey = ref("");

/* FILTERING */
const filteredLogs = computed(() => {
  const s = searchTerm.value.toLowerCase();
  return logs.value.filter(
    (l) =>
      l.subject?.toLowerCase().includes(s) ||
      l.recipient_email?.toLowerCase().includes(s)
  );
});

/* FUNCTIONS */
function formatDatetime(dt: any) {
  return dt ? new Date(dt).toLocaleString("id-ID") : "-";
}

async function loadLogs() {
  try {
    const { data } = await axios.get("/api/email/logs");
    logs.value = data || [];
  } catch (e) {
    console.error(e);
  }
}

function openTypeModal() {
  showTypeModal.value = true;
}
function closeTypeModal() {
  showTypeModal.value = false;
}

function goToMahasiswa() {
  router.push("/manajemen-undangan-mahasiswa");
  closeTypeModal();
}

function goToTamu() {
  router.push("/manajemen-undangan-tamu");
  closeTypeModal();
}

function openGenerateQr() {
  showGenerateQr.value = true;
}
function closeGenerateQr() {
  showGenerateQr.value = false;
  qrKey.value = "";
}

async function submitGenerateQr() {
  try {
    await axios.post("/api/email/generate-qr", { key: qrKey.value || undefined });
    alert("Hash QR berhasil disimpan!");
    closeGenerateQr();
  } catch {
    alert("Gagal menyimpan hash QR.");
  }
}

async function retry(log: any) {
  if (!confirm("Kirim ulang surel ini?")) return;
  try {
    await axios.post(`/api/email/retry/${log.id_sendStatus}`);
    await loadLogs();
  } catch {
    alert("Gagal mengirim ulang.");
  }
}

onMounted(loadLogs);
</script>

<style scoped>

.page-container {
  min-height: 100vh;
  padding: 2rem;

  /* SAMAKAN DENGAN HALAMAN GENERATE QR */
  background: linear-gradient(135deg, #051a3d, #0a3c88);
  background-size: cover;
  background-repeat: no-repeat;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 14px;
  width: 360px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.modal-content h3 {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.modal-btn {
  width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  border: none;
  margin-bottom: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s;
  color: #fff;
}

.modal-btn.mhs {
  background: #3b82f6;
}

.modal-btn.tamu {
  background: #8b5cf6;
}

.modal-btn:hover {
  opacity: 0.9;
}

.modal-close {
  background: #e5e7eb;
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
</style>
