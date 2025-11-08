<template>
    <div v-if="modal.isOpen.value" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <!-- Gunakan component Lucide Icon -->
            <component :is="iconComponent" class="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-bold mb-2">{{ modal.title }}</h3>
            <p class="text-sm text-gray-300 mb-4">{{ modal.message }}</p>
            <div class="flex justify-end gap-2">
              <button @click="modal.close(false)" class="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
              <button @click="modal.close(true)" class="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useModal } from '../composables/useModal'
  import { AlertCircle, HelpCircle, CheckCircle } from 'lucide-vue-next'
  
  const modal = useModal()
  
  const iconComponent = computed(() => {
    switch (modal.type.value) {
      case 'alert': return AlertCircle
      case 'question': return HelpCircle
      case 'success': return CheckCircle
      default: return AlertCircle
    }
  })
  </script>
  