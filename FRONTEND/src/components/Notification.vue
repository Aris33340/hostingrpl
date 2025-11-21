<template>
    <transition name="slide-fade">
        <div v-if="show" :class="[
            'fixed top-6 right-6 max-w-md rounded-xl shadow-2xl border p-4 z-50 backdrop-blur-sm text-white transition-all',
            type === 'success'
                ? 'bg-green-500/90 border-green-400'
                : 'bg-red-500/90 border-red-400',
        ]">
            <div class="flex items-start gap-3">
                <!-- Success Icon -->
                <svg v-if="type === 'success'" class="w-6 h-6 text-white flex-shrink-0" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>

                <!-- Error Icon -->
                <svg v-else class="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>

                <!-- Text -->
                <div class="flex-1">
                    <h3 class="text-white font-semibold mb-1">
                        {{ type === 'success' ? 'Success' : 'Error' }}
                    </h3>
                    <p class="text-white/90 text-sm">{{ message }}</p>
                </div>

                <!-- Close Button -->
                <button @click="$emit('close')" class="text-white/80 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    show: { type: Boolean, default: false },
    type: { type: String, default: "success" }, // "success" | "error"
    message: { type: String, default: "" },
});

defineEmits(["close"]);
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.4s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>