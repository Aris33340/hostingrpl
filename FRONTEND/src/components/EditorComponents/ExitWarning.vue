<template>
    <div v-if="false" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-40" @click="showWarningSavedProject = false"></div>

        <!-- Modal Box -->
        <div class="relative bg-white rounded-lg shadow-2xl w-[40rem] p-6 animate-fadeIn">

            <!-- Close Button -->
            <div @click="showWarningSavedProject = false"
                class="absolute right-0 top-0 m-1 bg-red-600 text-white text-sm w-7 h-7 flex rounded-md justify-center items-center cursor-pointer transition-all duration-200 hover:bg-red-500 hover:scale-105">
                X
            </div>

            <!-- Title -->
            <h2 class="text-2xl text-black font-semibold mb-3">
                Perubahan Belum Disimpan
            </h2>

            <!-- Subtexts -->
            <p class="text-lg text-gray-700 mb-1">Anda yakin ingin keluar?</p>
            <p class="text-base text-gray-600">
                Semua perubahan yang belum disimpan akan hilang.
            </p>

            <!-- Footer Buttons -->
            <div class="flex gap-4 mt-10">
                <button class="w-1/2 h-11 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition">
                    Save Draft
                </button>

                <button @click="render"
                    class="w-1/2 h-11 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 active:bg-blue-800 transition">
                    Keluar
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
const render = ref()
</script>