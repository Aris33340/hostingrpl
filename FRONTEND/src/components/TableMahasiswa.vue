<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto text-gray-800">
    <table class="w-full text-sm overflow-x-auto">
      <thead class="bg-gray-50 text-gray-700">
        <tr>
          <th class="p-3 border-b text-center">NIM</th>
          <th class="p-3 border-b text-center">Nama</th>
          <th class="p-3 border-b text-center">Prodi</th>
          <th class="p-3 border-b text-center">Kelas</th>
          <th class="p-3 border-b text-center">No. Telp</th>
          <th class="p-3 border-b text-center">Daerah Asal</th>
          <th class="p-3 border-b text-center">Penempatan</th>
          <th class="p-3 border-b text-center">Judul Skripsi</th>
          <th class="p-3 border-b text-center">Pembimbing</th>
          <th class="p-3 border-b text-center">Orang Tua</th>
          <th class="p-3 border-b text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="m in mahasiswa" :key="m.nim" class="hover:bg-gray-50">
          <td class="p-3 border-b">{{ m.nim }}</td>
          <td class="p-3 border-b">{{ m.nama }}</td>
          <td class="p-3 border-b">{{ m.prodi || '-' }}</td>
          <td class="p-3 border-b">{{ m.kelas || '-' }}</td>
          <td class="p-3 border-b">{{ m.no_telp || '-' }}</td>
          <td class="p-3 border-b">{{ m.daerah_asal || '-' }}</td>
          <td class="p-3 border-b">{{ m.daerah_penempatan || '-' }}</td>
          <td class="p-3 border-b truncate max-w-[220px]">{{ m.judul_skripsi || '-' }}</td>
          <td class="p-3 border-b">{{ m.dosen_pembimbing || '-' }}</td>
          <td class="p-3 border-b">{{ m.nama_orang_tua || '-' }}</td>
          <td class="p-3 border-b text-center">
            <div class="flex flex-row justify-center">
              <button @click="$emit('edit', m)" class="px-2 py-1 w-full rounded-md bg-yellow-400 hover:bg-yellow-500 text-white mr-2">✏️</button>
              <button @click="$emit('hapus', m)" class="px-2 py-1 w-full rounded-md bg-red-500 hover:bg-red-600 text-white">🗑️</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!mahasiswa.length" class="text-center p-6 text-gray-500">Tidak ada data mahasiswa</p>
  </div>
</template>

<script setup>
defineProps({
  mahasiswa: {
    type: Array,
    default: () => []
  }
})
</script>
