<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto text-gray-800">
    <table class="w-full text-sm overflow-x-auto">
      <thead class="bg-gray-50 text-gray-700">
        <tr>
          <th class="p-3 border-b text-center">ID Tamu</th>
          <th class="p-3 border-b text-center">Nama</th>
          <th class="p-3 border-b text-center">Email</th>
          <th class="p-3 border-b text-center">Asal Instansi</th>
          <th class="p-3 border-b text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr 
          v-for="t in tamu" 
          :key="t.id_tamu" 
          class="hover:bg-gray-50"
        >
          <td class="p-3 border-b">{{ t.id_tamu }}</td>
          <td class="p-3 border-b">{{ t.nama }}</td>
          <td class="p-3 border-b">{{ t.email }}</td>
          <td class="p-3 border-b">{{ t.asal_instansi || '-' }}</td>

          <td class="p-3 border-b text-center">
            <div class=" flex flex-row justify-center">

              <button
                @click="$emit('edit', t)"
                class="px-2 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white mr-2"
              >
                ✏️
              </button>
  
              <button
                @click="$emit('hapus', t)"
                class="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!tamu.length" class="text-center p-6 text-gray-500">
      Tidak ada data tamu
    </p>
  </div>
</template>

<script setup>
defineProps({
  tamu: {
    type: Array,
    default: () => []
  }
})

defineEmits(['edit', 'hapus'])
</script>
