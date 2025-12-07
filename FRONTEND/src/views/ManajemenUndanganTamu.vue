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
            <input type="file" accept=".pdf" @change="handlePdfUpload" hidden />
          </label>

          <input v-model="search" type="text" placeholder="File" class="search-input" />

          <div class="file-list">
            <div v-for="(f, idx) in filteredFiles" :key="idx" class="file-item">
              {{ f }}
            </div>

            <div v-if="filteredFiles.length === 0" class="empty-state">
              Belum ada file PDF. Pilih file di atas untuk melampirkan.
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="right-panel">

          <label>Subjek Email</label>
          <input v-model="form.subject" class="input-box" type="text" placeholder="Masukkan subjek email" />

          <label>Penerima</label>
          <input v-model="form.to" class="input-box" type="text"
            placeholder="contoh: tamu1@gmail.com, tamu2@gmail.com" />

          <label>Isi Pesan</label>
          <textarea v-model="form.body" class="textarea-box" placeholder="Tulis isi pesan undangan..."></textarea>

          <!-- ATTACHMENT BOX -->
          <div class="mb-6">
            <label class="block font-semibold mb-1">File Terlampir</label>

            <div class="attachment-box">
              <span v-if="files.length" class="text-gray-700">
                <b>{{ files[0] }}</b>
                <span class="text-xs text-gray-500">
                  (1 file PDF siap dikirim)
                </span>
              </span>

              <span v-else class="text-gray-700 text-sm">
                Belum ada surel yang dilampirkan. Klik tombol
                <b>Impor Template Undangan</b> di sebelah kiri untuk melampirkan.
              </span>
            </div>
          </div>

          <button class="submit-btn" @click="sendMassal">
            Kirim
          </button>

        </div> <!-- END RIGHT PANEL -->

      </div> <!-- END form-section -->

    </div> <!-- END main-card -->

  </div> <!-- END page-container -->
</template>



<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// >>> Fungsi Tombol Kembali
function goBack() {
  router.push("/manajemen-undangan");
}

// STATE
const files = ref<string[]>([]);
const savedFileId = ref<number | null>(null);
const search = ref("");

const form = ref({
  subject: "",
  to: "",
  body: "",
});

// Upload PDF
async function handlePdfUpload(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await axios.post("/email/upload-tamu", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    files.value = [file.name];
    savedFileId.value = res.data.fileId;

    alert("PDF berhasil diupload!");
  } catch (err) {
    alert("Gagal mengupload PDF.");
  }
}

const filteredFiles = computed(() => {
  return files.value.filter((x) =>
    x.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Send Email Massal
async function sendMassal() {
  if (!form.value.subject || !form.value.body || !form.value.to) {
    alert("Subjek, Penerima, dan Isi Pesan wajib diisi!");
    return;
  }

  if (!savedFileId.value) {
    alert("Harap upload template undangan (PDF) terlebih dahulu!");
    return;
  }

  const emailList = form.value.to
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  try {
    await axios.post("/email/send-tamu-massal", {
      subject: form.value.subject,
      body: form.value.body,
      recipients: emailList,
      fileId: savedFileId.value,
    });

    alert("Undangan tamu berhasil dikirim!");
  } catch (err) {
    alert("Gagal mengirim undangan tamu.");
  }
}
</script>



<style scoped>
.page-container {
  background: linear-gradient(135deg, #051a3d, #0a3c88);
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
}

.main-card {
  width: 85%;
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 25px;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}

.form-section {
  display: flex;
  gap: 2rem;
}

/*** LEFT PANEL ***/
.left-panel {
  width: 35%;
}

.import-btn {
  display: block;
  background: #06b6d4;
  color: white;
  text-align: center;
  padding: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
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
  background: #eaf3ff;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.4rem;
}

.empty-state {
  color: #aaa;
  text-align: center;
  margin-top: 2rem;
}

/*** RIGHT PANEL ***/
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
  margin-bottom: 1rem;
  border: 1px solid #ccc;
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
