<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">
        Tambah Akun Email Pengirim
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email Pengirim (SMTP User)
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="contoh: noreply@stis.ac.id"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Host
            </label>
            <input
              v-model="form.host"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Port
            </label>
            <input
              v-model.number="form.port"
              type="number"
              required
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="465 / 587"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password / App Password
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
        </div>

        <p class="text-xs text-gray-500">
          Akun yang baru ditambahkan akan otomatis menjadi akun aktif untuk pengiriman email.
        </p>

        <div v-if="error" class="text-xs text-red-500">
          {{ error }}
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-3 py-1.5 text-xs rounded-full border border-gray-300 hover:bg-gray-50"
            @click="emit('close')"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-1.5 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            :disabled="loading"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan & Aktifkan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits(["close"]);

const form = ref({
  email: "",
  host: "",
  port: 587,
  password: "",
});

const loading = ref(false);
const error = ref("");

async function handleSubmit() {
  error.value = "";
  loading.value = true;

  try {
    await axios.post("/api/email/accounts", {
      email: form.value.email,
      host: form.value.host,
      port: form.value.port,
      password: form.value.password,
    });

    alert("Akun email berhasil disimpan dan diaktifkan.");
    emit("close");
  } catch (err: any) {
    console.error(err);
    error.value =
      err?.response?.data?.message ||
      "Gagal menyimpan akun email. Periksa konfigurasi SMTP.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
</style>
