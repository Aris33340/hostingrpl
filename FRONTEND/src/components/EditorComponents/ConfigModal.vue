<template>
    <div v-if="props.showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-40" @click="emit('update:showModal', false)"></div>

        <!-- Modal Box -->
        <div class="relative bg-white rounded-lg shadow-2xl w-[40rem] p-6 animate-fadeIn">
            <div @click="emit('update:showModal', false)"
                class="absolute right-0 top-0 m-1 bg-red-600 p-4 w-4 h-4 flex rounded-lg justify-center items-center cursor-pointer transition-all duration-200 hover:bg-red-400 hover:scale-105">
                X </div>
            <!-- Title -->
            <h2 class="text-2xl text-black font-semibold mb-4">Project Configuration</h2>

            <!-- Input Nama Project -->
            <div class="text-black mb-6">
                <label class="text-sm text-left block font-medium">Nama Project</label>
                <input v-model="projectName" type="text" placeholder="Masukkan nama project"
                    class="mt-1 w-full border bg-white text-black rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400" />
            </div>

            <!-- Mode Simpan -->
            <div class="text-black mb-6">
                <label class="text-sm text-left block font-medium">Mode Output</label>
                <div class="mt-2 flex flex-col gap-2">

                    <label class="cursor-pointer flex items-center gap-2">
                        <input class="cursor-pointer" type="checkbox" v-model="saveToDatabase" />
                        <span>Simpan ke Database</span>
                    </label>

                    <label class="cursor-pointer flex items-center gap-2">
                        <input class="cursor-pointer" type="checkbox" v-model="downloadZip" />
                        <span>Download ZIP</span>
                    </label>

                </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex gap-3 mt-8">
                <button @click="submit" :disabled="props.isLoadingRender"
                    class="mt-auto h-10 px-5 bg-blue-600 w-full text-white hover:bg-blue-500 active:bg-blue-900 rounded-lg cursor-pointer transition-colors duration-200">
                    <span v-if="!props.isLoadingRender" class="font-bold">RENDER</span>
                    <span v-else class="flex items-center">
                        <svg class="animate-spin h-5 w-5 mr-3 text-gray-50" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span>Merender...</span>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const saveToDatabase = ref()
const downloadZip = ref()
const projectName = ref()
const props = defineProps({
    showModal: { type: Boolean, default: false },
    isLoadingRender: { type: Boolean, default: false }
})
const emit = defineEmits(['update:showModal','update:isLoadingRender','submit'])
const submit = () => {
    emit("submit", {
        projectName: projectName.value,
        saveToDB: saveToDatabase.value,
        asZip: downloadZip.value
    });
};
</script>