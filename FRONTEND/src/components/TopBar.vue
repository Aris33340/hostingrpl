<template>
    <div v-if="isTopBarVisible" class="mt-10 mx-10 bg-white rounded-xl p-4 flex justify-between items-center shadow-md mb-6">
        <h2 class="text-xl font-bold text-[#2e3e85] pl-2">{{ routeName }}</h2>
        <span class="text-gray-600 pr-2">Halo, {{ role }}</span>
    </div>
</template>
<script setup>
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
import { showNotification } from '../composables/useNotification';
import { useAuthStore } from '../stores/authStore';
const route = useRoute()
const authStore = useAuthStore()

const isTopBarVisible = computed(() => route.meta.showTopbar !== false);
const routeName = computed(() => route.name)
const role = computed(() => {
    try {
        return authStore.getPayload()?.role || ''
    } catch (err) {
        showNotification('warning', 'getPayload error:')
        return ''
    }
})
</script>