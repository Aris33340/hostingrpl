<template>
    <div class="w-full bg-gray-200 dark:bg-blue-600/20 p-1 rounded-xl relative flex select-none cursor-pointer">
        <div class="absolute top-1 bottom-1 w-1/2 bg-white dark:bg-blue-500 rounded-xl shadow-md transition-all duration-300"
            :style="{ transform: isMahasiswa ? 'translateX(0)' : 'translateX(95%)' }"></div>

        <div class="relative z-10 flex-1 text-center py-2 font-medium transition-all duration-200"
            :class="isMahasiswa ? 'text-gray-200' : ' dark:text-gray-400'" @click="change(true)">
            Mahasiswa
        </div>

        <div class="relative z-10 flex-1 text-center py-2 font-medium transition-all duration-200"
            :class="!isMahasiswa ? 'text-gray-200' : ' dark:text-gray-400'" @click="change(false)">
            Non Mahasiswa
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"

const emits = defineEmits(["change"])
const isMahasiswa = ref(true)

function change(value) {
    isMahasiswa.value = value      
    emits("change", value)         
}
</script>
