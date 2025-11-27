<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Pilih Jenis Undangan
      </h3>

      <p class="text-xs text-gray-500 mb-4">
        Pilih jenis email undangan yang ingin dikirim oleh Divisi Kesekretariatan.
      </p>

      <div class="space-y-3">
        <button
          class="w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between hover:bg-blue-50"
          @click="choose('MAHASISWA')"
        >
          <span class="font-medium text-gray-800">Undangan Mahasiswa</span>
          <span class="text-[11px] text-gray-500">Kirim ke peserta wisuda</span>
        </button>

        <button
          class="w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between hover:bg-blue-50"
          @click="choose('TAMU')"
        >
          <span class="font-medium text-gray-800">Undangan Tamu</span>
          <span class="text-[11px] text-gray-500">Kirim ke tamu undangan</span>
        </button>
      </div>

      <div class="mt-5 text-right">
        <button
          class="px-4 py-2 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
          @click="emit('close')"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "select-type", value: "MAHASISWA" | "TAMU"): void;
}>();

function choose(type: "MAHASISWA" | "TAMU") {
  emit("select-type", type);
  emit("close");
}
</script>
