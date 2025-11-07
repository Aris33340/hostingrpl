<template>
    <div class="min-h-screen min-w-full p-6">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-white mb-2">{{ router?.name || 'File Manager' }}</h1>
            <p class="text-blue-300">Halo Admin</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">

            <!-- Preview Container -->
            <div
                class="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 overflow-hidden flex flex-col">
                <!-- Upload Section -->
                <div class="p-4 border-b border-blue-500/20">
                    <div class="flex items-center gap-3">
                        <label class="flex-1 cursor-pointer">
                            <div
                                class="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 border border-blue-400/30">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                    </path>
                                </svg>
                                <span class="text-white font-medium">{{ selectedFile ? selectedFile.name : 'Choose File'
                                    }}</span>
                            </div>
                            <input type="file" @change="onFileChange" class="hidden">
                        </label>
                        <button @click="uploadFile" :disabled="!selectedFile || uploading"
                            class="px-6 py-3 bg-gradient-to-r from-rgb-custom to-blue-600 hover:from-blue-700 hover:to-rgb-custom rounded-xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30">
                            {{ uploading ? 'Uploading...' : 'Upload' }}
                        </button>
                    </div>

                    <!-- Progress Bar -->
                    <div v-if="uploading" class="mt-3 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div class="progress-bar-animated h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full transition-all duration-300"
                            :style="{ width: uploadProgress + '%' }"></div>
                    </div>
                </div>

                <!-- Preview Area -->
                <div class="flex-1 overflow-auto custom-scrollbar p-6">
                    <div v-if="!previewUrl" class="h-full flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-24 h-24 mx-auto text-blue-500/30 mb-4" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01">
                                </path>
                            </svg>
                            <p class="text-blue-300 text-lg">Select a file to preview</p>
                        </div>
                    </div>

                    <!-- Image Preview -->
                    <div v-else-if="previewType === 'image'" class="flex items-center justify-center h-full">
                        <img :src="previewUrl" alt="Preview"
                            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
                    </div>

                    <!-- PDF Preview -->
                    <div v-else-if="previewType === 'pdf'" class="h-full">
                        <iframe :src="previewUrl" class="w-full h-full rounded-lg border border-blue-500/20"></iframe>
                    </div>
                </div>
            </div>
            <div
                class="lg:col-span-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-4 overflow-hidden flex flex-col">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                        </svg>
                        Files
                    </h2>
                    <span class="text-sm text-blue-300">{{ files.length }} items</span>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar">
                    <ul class="space-y-2">
                        <li v-for="file in files" :key="file.id_file"
                            class="group bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-blue-500/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 flex-1 min-w-0">
                                    <svg v-if="getFileType(file.file_name) === 'pdf'"
                                        class="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z">
                                        </path>
                                    </svg>
                                    <svg v-else class="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="text-sm text-white truncate">{{ file.file_name }}</span>
                                </div>

                                <div class="flex items-center gap-1 ml-2">
                                    <button @click="viewFile(file)"
                                        class="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 transition-all duration-200"
                                        title="View">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                            </path>
                                        </svg>
                                    </button>

                                    <router-link v-if="getFileType(file.file_name) === 'pdf'"
                                        :to="{ path: '/editor', query: { fileId: file.id_file } }"
                                        class="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 transition-all duration-200"
                                        title="Edit">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                            </path>
                                        </svg>
                                    </router-link>

                                    <button @click="deleteFile(file)"
                                        class="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all duration-200"
                                        title="Delete">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Notification Popup -->
        <transition name="slide-fade">
            <div v-if="notification.show"
                :class="['fixed top-6 right-6 max-w-md rounded-xl shadow-2xl border p-4 z-50', 
                          notification.type === 'success' ? 'bg-green-500/90 border-green-400' : 'bg-red-500/90 border-red-400']">
                <div class="flex items-start gap-3">
                    <svg v-if="notification.type === 'success'" class="w-6 h-6 text-white flex-shrink-0" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <svg v-else class="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="flex-1">
                        <h3 class="text-white font-semibold mb-1">{{ notification.type === 'success' ? 'Success' :
                            'Error' }}</h3>
                        <p class="text-white/90 text-sm">{{ notification.message }}</p>
                    </div>
                    <button @click="notification.show = false" class="text-white/80 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import api from '@/api'
    import { showNotification } from "../composables/useNotification";

    const router = useRouter()
    const selectedFile = ref(null)
    const files = ref([])
    const previewUrl = ref(null)
    const previewType = ref(null)
    const uploading = ref(false)
    const uploadProgress = ref(0)
    const notification = ref({
        show: false,
        type: 'success',
        message: ''
    })

    const API_BASE = '/api/files'
    const getFileType = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase()
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image'
        if (ext === 'pdf') return 'pdf'
        return 'other'
    }

    const onFileChange = (event) => {
        selectedFile.value = event.target.files[0]
    }

    const uploadFile = async () => {
        if (!selectedFile.value) return

        uploading.value = true
        uploadProgress.value = 0

        const formData = new FormData()
        formData.append('file', selectedFile.value)

        const progressInterval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value += 10
            }
        }, 200)

        try {
            const res = await api.post(`${API_BASE}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            clearInterval(progressInterval)
            uploadProgress.value = 100

            setTimeout(() => {
                showNotification('success', 'File berhasil diupload!')
                files.value.push(res.data)
                selectedFile.value = null
                uploading.value = false
                uploadProgress.value = 0
            }, 500)
        } catch (err) {
            clearInterval(progressInterval)
            uploading.value = false
            uploadProgress.value = 0
            showNotification('error', 'Gagal upload: ' + (err.response?.data?.message || err.message))
            console.log(err.response?.data?.message)
        }
    }

    const viewFile = async (file) => {
        try {
          const res = await api.get(`${API_BASE}/${file.id_file}/file`, {
            responseType: 'blob',
          });
      
          let mimeType = res.headers['content-type'];
          if (!mimeType || mimeType === 'application/octet-stream') {
            const ext = file.file_name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) mimeType = `image/${ext}`;
            else if (ext === 'pdf') mimeType = 'application/pdf';
          }
      
          const blob = new Blob([res.data], { type: mimeType });
          const url = URL.createObjectURL(blob);
      
          if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
          }
      
          previewUrl.value = url;
          previewType.value = mimeType.startsWith('image/')
            ? 'image'
            : mimeType === 'application/pdf'
            ? 'pdf'
            : 'other';
        } catch (err) {
          showNotification('error', 'Gagal menampilkan file.');
          console.error('View error:', err);
        }
      };

    const deleteFile = async (file) => {
        if (!confirm(`Hapus file "${file.file_name}"?`)) return

        try {
            await api.delete(`${API_BASE}/${file.id_file}`)
            files.value = files.value.filter(f => f.id_file !== file.id_file)

            if (previewUrl.value) {
                URL.revokeObjectURL(previewUrl.value)
                previewUrl.value = null
                previewType.value = null
            }

            showNotification('success', 'File berhasil dihapus!')
        } catch (err) {
            showNotification('error', 'Gagal menghapus file: ' + (err.response?.data?.message || err.message))
        }
    }

    const loadFiles = async () => {
        try {
            const res = await api.get(`${API_BASE}/all`)
            files.value = res.data
        } catch {
            files.value = []
        }
    }

    onMounted(loadFiles)
</script>

<style scoped>
    .rgb-custom {
        background-color: rgb(18, 75, 150);
    }

    .from-rgb-custom {
        --tw-gradient-from: rgb(18, 75, 150);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(18, 75, 150, 0));
    }

    .to-rgb-custom {
        --tw-gradient-to: rgb(18, 75, 150);
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.5);
        border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.7);
    }

    @keyframes progress-animation {
        0% {
            background-position: 0% 50%;
        }

        100% {
            background-position: 100% 50%;
        }
    }

    .progress-bar-animated {
        background-size: 200% 100%;
        animation: progress-animation 1.5s ease-in-out infinite;
    }

    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.2s ease-in;
    }

    .slide-fade-enter-from {
        transform: translateX(20px);
        opacity: 0;
    }

    .slide-fade-leave-to {
        transform: translateX(20px);
        opacity: 0;
    }
</style>