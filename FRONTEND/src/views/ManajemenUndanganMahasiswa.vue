<template>
  <div class="page-container">

    <!-- Tombol Kembali -->
    <button @click="goBack"
      class="absolute top-6 left-6 px-4 py-2 rounded-full bg-black text-white shadow hover:bg-gray-800 transition">
      ← Kembali
    </button>

    <div class="main-card">
      <h2 class="title">Tulis Surel</h2>

      <div class="form-section">

        <!-- LEFT PANEL -->
        <div class="left-panel">
          <label class="import-btn">
            Impor Template Undangan
            <input type="file" accept=".zip" @change="handleZipUpload" hidden />
          </label>

          <input v-model="search" type="text" placeholder="Cari File" class="search-input" />

          <div class="file-list">

            <div v-for="(f, idx) in filteredFiles" :key="idx" class="file-item">
              📄 {{ f }}
            </div>

            <div v-if="filteredFiles.length === 0" class="empty-state">
              Tidak ada file. Upload ZIP terlebih dahulu.
            </div>

          </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="right-panel">

          <label>Subjek Email</label>
          <input v-model="form.subject" class="input-box" type="text" placeholder="Masukkan subjek email" />

          <label>Isi Pesan</label>
          <textarea v-model="form.body" class="textarea-box" placeholder="Tulis isi pesan undangan..."></textarea>

          <!-- ATTACHMENT BOX -->
          <div class="mb-6">
            <label class="block font-semibold mb-1">File Terlampir</label>

            <div class="attachment-box">

              <!-- Jika ZIP sudah diupload -->
              <span v-if="zipFileName" class="text-gray-700">
                <b>{{ zipFileName }}</b>
                <span class="text-xs text-gray-500">
                  ({{ files.length }} file PDF siap dikirim)
                </span>
              </span>

              <!-- Jika ZIP belum diupload -->
              <span v-else class="text-gray-700 text-sm">
                Belum ada surel yang dilampirkan. Klik tombol
                <b>Impor Template Undangan</b> di sebelah kiri untuk melampirkan.
              </span>

            </div>
          </div>

          <button class="submit-btn" @click="sendBulk">
            Kirim
          </button>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import emailApi from "../api/email";

const router = useRouter();

const files = ref<string[]>([]);
const search = ref("");
const zipFileName = ref("");

const form = ref({
  subject: "",
  body: "",
});

// UPLOAD ZIP
async function handleZipUpload(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  zipFileName.value = file.name; // ✔ SIMPAN NAMA FILE

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await emailApi.post("/import-zip", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data?.results) {
      files.value = res.data.results.map((r: any) => r.file);
      alert("ZIP berhasil diproses!");
    }
  } catch (err) {
    console.error(err);
    alert("Gagal upload ZIP.");

    // ✔ RESET DATA KETIKA ERROR
    zipFileName.value = "";
    files.value = [];
  }
}

const filteredFiles = computed(() =>
  files.value.filter((x) =>
    x.toLowerCase().includes(search.value.toLowerCase())
  )
);

// SEND BULK
async function sendBulk() {
  if (!form.value.subject || !form.value.body) {
    alert("Subjek dan isi pesan wajib diisi.");
    return;
  }

  if (files.value.length === 0) {
    alert("Harap upload file ZIP terlebih dahulu.");
    return;
  }

  try {
    await emailApi.post("/send-mahasiswa-bulk", {
      subject: form.value.subject,
      body: form.value.body,
    });

    alert("Proses pengiriman email dimulai.");
    router.push("/manajemen-undangan");
  } catch (err) {
    console.error(err);
    alert("Gagal mengirim undangan.");
  }
}

function goBack() {
  router.push("/manajemen-undangan");
}
</script>


<style scoped>
/* =============== LAYOUT =============== */

.page-container {
  background: linear-gradient(135deg, #051a3d, #0a3c88);
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
}

.main-card {
  width: 85%;
  margin: 3rem auto;
  background: white;
  padding: 2rem;
  border-radius: 25px;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-section {
  display: flex;
  gap: 2rem;
}

/* LEFT */
.left-panel {
  width: 35%;
}

.import-btn {
  display: block;
  background: #1d4ed8;
  color: white;
  text-align: center;
  padding: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
}

.search-input {
  width: 100%;
  padding: 0.6rem;
  margin-top: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.file-list {
  margin-top: 1rem;
  height: 350px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 12px;
}

.file-item {
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.4rem;
}

/* RIGHT */
.right-panel {
  width: 65%;
}

.input-box {
  width: 100%;
  border: 1px solid #ccc;
  padding: 0.8rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.textarea-box {
  width: 100%;
  height: 200px;
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.attachment-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-size: 0.9rem;
  min-height: 55px;
}

.submit-btn {
  background: #1e40af;
  color: white;
  width: 100%;
  max-width: 420px;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 1.2rem;
  margin: 0 auto;
  display: block;
}
</style>
