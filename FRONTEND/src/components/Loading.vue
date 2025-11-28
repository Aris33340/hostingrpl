<template>
    <transition name="fade">
        <div v-if="isLoading"
            class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div class="relative flex flex-col items-center">
                <!-- Ikon Topi Wisuda -->
                <div class="animate-toss mb-4 relative z-10">
                    <img class="w-56" src="../assets/icons/graduationhat.png" alt="graduationhat">
                </div>

                <!-- Bayangan -->
                <div class="w-24 h-4 bg-black rounded-full animate-shadow mb-6 blur-sm"></div>

                <!-- Pesan -->
                <div class="text-white text-center">
                    <h3 class="text-2xl font-bold mb-2 text-yellow-400">Harap Tunggu!</h3>
                    <p class="text-gray-200 text-lg">{{ message }}</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { useLoading } from "../composables/useLoading"

const { isLoading, message } = useLoading();
</script>

<style scoped>
@keyframes toss {
    0% {
        transform: translateY(0) rotate(0deg);
    }

    40% {
        transform: translateY(-30px) rotate(-10deg);
    }

    50% {
        transform: translateY(-30px) rotate(10deg);
    }

    100% {
        transform: translateY(0) rotate(0deg);
    }
}

@keyframes shadow-pulse {
    0% {
        transform: scale(1);
        opacity: 0.3;
    }

    40% {
        transform: scale(0.6);
        opacity: 0.1;
    }

    100% {
        transform: scale(1);
        opacity: 0.3;
    }
}

.animate-toss {
    animation: toss 1.5s ease-in-out infinite;
}

.animate-shadow {
    animation: shadow-pulse 1.5s ease-in-out infinite;
}

/* Transition Fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>