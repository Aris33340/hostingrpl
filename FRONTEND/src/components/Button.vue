<template>
    <router-link :to="route.path" class="group relative w-full flex flex-col items-center">
        <div class="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-md"
            :class="isActive(route.path)
                ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600'
                : 'text-gray-600 hover:bg-blue-50'">
            <component :is="route.meta.icon" class="w-4 h-4" />
        </div>

        <div
            class="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
            {{ route.meta.title }}
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
    </router-link>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
    route: {
        type: Object,
        required: true
    }
})

const currentRoute = useRoute()

const isActive = (path) => computed(() => currentRoute.path === path).value
</script>