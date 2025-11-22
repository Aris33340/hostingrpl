<template>
    <div class="fixed inset-0 flex bg-gray-50 overflow-hidden">
        <!-- SidePreview -->
        <div
            class="flex flex-col relative h-full w-28 group transition-all duration-300 ease-in-out hover:w-60 bg-white shadow-xl z-20">
            <div class="h-16 flex items-center justify-center p-2 border-b">
                <span
                    class="text-lg font-semibold text-blue-600 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-hover:delay-150">
                    Pages
                </span>
            </div>

            <div
                class="w-full h-full flex flex-col items-center gap-4 py-4 hover:overflow-y-scroll scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-100">
                <button v-for="(page, index) in pages" :key="index" :aria-label="`Page ${page.pageNumber}`"
                    :aria-pressed="activePage === page.pageNumber" @click="selectPage(page.pageNumber)" :class="[
                        'relative w-[90%] shrink-0 aspect-[8.5/11] rounded-lg shadow-md transition overflow-hidden duration-200 ease-in-out',
                        activePage === page.pageNumber
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:scale-[1.03] hover:shadow-lg',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600'
                    ]">
                    <div
                        class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500">

                        <div ref="thumbContainer" class="w-full h-full flex items-center justify-center"></div>
                        <span class="absolute top-1 left-2 text-xs font-medium text-gray-600 group-hover:text-blue-700">
                            {{ page.pageNumber }}
                        </span>
                    </div>
                </button>
            </div>

            <div class="absolute bottom-0 w-full p-2 bg-white border-t shadow-inner">
                <button @click="activateFab" :disabled="fab.enabled"
                    class="w-full py-2 px-4 text-sm font-medium rounded-md transition-colors"
                    :class="fab.enabled ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'">
                    {{ fab.enabled ? 'Template Set' : 'Set as Template' }}
                </button>
            </div>
        </div>
        <!-- SidePreview -->


        <!-- WorkSpace -->
        <div class="flex-1 flex flex-col items-center relative overflow-auto">
            <div
                class="bg-white w-[90%] h-14 rounded-3xl mt-4 shadow-lg flex items-center justify-center text-gray-600 z-10">
                <div class="flex space-x-4">
                    <span v-for="i in 5" :key="i" class="px-4 py-1 hover:bg-gray-100 rounded-full cursor-pointer">Tool
                        {{ i }}</span>
                </div>
            </div>

            <div class="relative mt-5 w-full h-full flex items-center justify-center p-8 overflow-auto">
                <!-- DotPlacement -->

                <div ref="workspaceDiv" class="shadow-2xl border bg-white relative"
                    :style="{ width: `${workSpaceViewport.width}`, height: `${workSpaceViewport.height}`, }">
                    <!-- DotPlacement -->
                    <div v-if="placement.mode && placement.mode !== 'asset_select'" class="absolute inset-0 z-40"
                        @mousemove="updateDotPosition" @click.self="confirmPlacement" @keyup.esc="cancelPlacement"
                        tabindex="0">

                        <!-- RED DOT -->
                        <div class="absolute w-8 h-8 rounded-full bg-red-500/80 border-2 border-white pointer-events-auto"
                            @click="confirmPlacement"
                            :style="{ left: `${dotPosition.x - 16}px`, top: `${dotPosition.y - 16}px` }">
                        </div>
                        <!-- Small pop-up (Confirm / Cancel) -->
                        <div class="absolute p-2 bg-white rounded-lg shadow-xl flex space-x-2 pointer-events-auto"
                            :style="{ left: `${dotPosition.x + 20}px`, top: `${dotPosition.y + 20}px` }">

                            <button @click.stop="cancelPlacement" class="text-red-500 text-sm hover:text-red-700">
                                Cancel (Esc)
                            </button>

                            <button @click.stop="confirmPlacement"
                                class="text-blue-600 text-sm font-medium hover:text-blue-800">
                                Confirm
                            </button>
                        </div>
                    </div>

                    <canvas id="work-space" @click.stop="cancelPlacement" class="bg-blue-200 w-full h-full">
                    </canvas>

                    <div v-for="object in objects" :key="object.id" :style="{
                        left: `${object.x}px`,
                        top: `${object.y}px`,
                        width: `${object.width}px`,
                        height: `${object.height}px`,
                        transform: `rotate(${object.rotation}deg)`,
                        position: 'absolute',
                    }" @mousedown.stop="startDrag($event, object.id)" :class="[
                        'cursor-move border border-dashed transition-all duration-100',
                        selectedObjectId === object.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                    ]">
                        <div class="w-full h-full flex items-center justify-center text-xs">
                            <!-- Jika type 'text', tampilkan teks -->
                            <span v-if="object.type === 'text'" :style="{ fontSize: `${object.props.fontSize}px` }">
                                {{ object.props.content }}
                            </span>
                            <!-- Jika type 'image', tampilkan gambar -->
                            <img v-else-if="object.type === 'image'" :src="getAssetUrl(object.props.assetId)"
                                :alt="`Asset ${object.props.assetId}`" class="w-full h-full object-cover" />
                            <!-- Jika type lain (e.g., 'qr'), tampilkan placeholder atau implementasi khusus -->
                            <span v-else>{{ object.type }} Object #{{ object.id }}</span>
                        </div>
                        <!-- Handle rotasi, hanya tampil jika objek dipilih -->
                        <div v-if="selectedObjectId === object.id"
                            class="absolute w-4 h-4 bg-blue-700 rounded-full cursor-nesw-resize -top-2 -right-2"
                            @mousedown.stop="startRotate($event, object.id)" style="transform: rotate(45deg);">
                            <RotateIcon class="w-4 h-4 text-white" />
                        </div>
                        <div v-if="selectedObjectId === object.id"
                            class="absolute w-4 h-4 bg-blue-500 rounded-full cursor-se-resize -bottom-2 -right-2"
                            @mousedown.stop="startResize($event, object.id)">
                        </div>
                    </div>

                </div>

                <!--add object container -->
                <div class="fixed right-5 bottom-5 z-50 group">
                    <div :class="[
                        'relative bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl transition-all duration-300 ease-out',
                        fab.enabled ? 'opacity-100 pointer-events-auto cursor-pointer group-hover:h-72 group-hover:rounded-2xl' : 'opacity-40 pointer-events-none',
                        'flex flex-col items-center justify-center overflow-hidden'
                    ]" :title="!fab.enabled ? 'Set as template to enable' : 'Add Content'" tabindex="0">
                        <div
                            :class="['absolute transition-opacity duration-300', fab.enabled ? 'group-hover:opacity-0' : '']">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>

                        </div>

                        <ul :class="[
                            'w-full h-full flex flex-col justify-evenly items-center transition-opacity duration-300 delay-150',
                            fab.enabled ? 'group-hover:opacity-100' : 'opacity-0'
                        ]">
                            <li class="relative">
                                <button @click="startPlacement('qr')" aria-label="Add QR"
                                    class="w-10 h-10 rounded-full bg-white text-blue-600 shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white">
                                    <svg class="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v.01m0 4v.01m0 4v.01m0 4v.01m-4-8h.01M8 8h.01m8 4h.01m-4 8h.01">
                                        </path>
                                    </svg>
                                </button>
                                <span role="tooltip"
                                    class="absolute left-full ml-3 px-3 py-1 bg-black text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 delay-150">
                                    Add QR
                                </span>
                            </li>

                            <li class="relative">
                                <button @click="startPlacement('text')" aria-label="Add Text"
                                    class="w-10 h-10 rounded-full bg-white text-blue-600 shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white">
                                    <svg class="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6V4m0 2h4m-4 0H8m0 0a2 2 0 100 4m0-4a2 2 0 110 4m4-4a2 2 0 100 4m0-4a2 2 0 110 4">
                                        </path>
                                    </svg>
                                </button>
                                <span role="tooltip"
                                    class="absolute left-full ml-3 px-3 py-1 bg-black text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 delay-150">
                                    Add Text
                                </span>
                            </li>

                            <li class="relative">
                                <button @click="openAssetSelector" aria-label="Add Image"
                                    class="w-10 h-10 rounded-full bg-white text-blue-600 shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white">
                                    <svg class="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-1-5a2 2 0 11-4 0 2 2 0 014 0zM6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                </button>
                                <span role="tooltip"
                                    class="absolute left-full ml-3 px-3 py-1 bg-black text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 delay-150">
                                    Add Image
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- WorkSpace -->

        <!-- Settings -->
        <transition>
            <div v-if="selectedObjectId"
                class="w-80 h-full bg-white shadow-xl z-20 transition-all duration-300 overflow-y-auto p-4 border-l">
                <h3 class="text-lg font-bold mb-4">Properties</h3>
                <div v-if="selectedObject.type === 'text'">
                    <label class="block text-sm font-medium text-gray-700">Font Size</label>
                    <input type="number" :value="selectedObject.props.fontSize"
                        @input="updateProperty(selectedObjectId, 'fontSize', $event.target.value)"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700">X Position (px)</label>
                    <input type="number" :value="Math.floor(selectedObject.x)"
                        @input="updateObjectTransform(selectedObjectId, { x: $event.target.value })"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700">Y Position (px)</label>
                    <input type="number" :value="Math.floor(selectedObject.y)"
                        @input="updateObjectTransform(selectedObjectId, { y: $event.target.value })"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div class="mt-4">
                    <button @click="deleteObject(selectedObjectId)"
                        class="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Delete Object
                    </button>
                </div>
            </div>
            <!-- Settings -->
        </transition>


        <!-- ModalImage -->
        <div v-if="placement.mode === 'asset_select'"
            class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative animate-fadeIn">
                <!-- Close Button -->
                <button @click="cancelPlacement"
                    class="absolute top-3 right-3 w-8 h-8 flex items-center text-black active:bg-gray-400 justify-center rounded-full hover:bg-gray-200 transition">
                    ✕
                </button>


                <!-- Title -->
                <h3 class="text-2xl font-semibold mb-5 text-gray-800">Select Image Asset</h3>
                <!-- Asset Grid -->
                <div class="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
                    <div v-for="asset in assetLibrary" :key="asset.id" @click="selectAsset(asset.id)" :class="[
                        'w-full h-24 border rounded-xl cursor-pointer overflow-hidden shadow-sm transition-all',
                        placement.selectedAssetId === asset.id
                            ? 'ring-4 ring-indigo-500 scale-105'
                            : 'hover:shadow-md hover:border-indigo-300'
                    ]">
                        <img :src="asset.url" :alt="asset.name" class="w-full h-full object-cover" />
                    </div>
                </div>


                <!-- Footer Actions -->
                <div class="mt-6 space-y-4">
                    <!-- Add Button -->
                    <div class="flex gap-5">
                        <button @click="deleteImg" :disabled="!placement.selectedAssetId" :class="[
                            'w-full py-2.5 rounded-xl font-medium text-white transition',
                            placement.selectedAssetId
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        ]">
                            Delete Image
                        </button>
                        <button @click="startPlacement('image', placement.selectedAssetId)"
                            :disabled="!placement.selectedAssetId" :class="[
                                'w-full py-2.5 rounded-xl font-medium text-white transition',
                                placement.selectedAssetId
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                            ]">
                            Add Image
                        </button>
                    </div>
                    <div v-if="uploadProgress > 0" class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div class="bg-indigo-600 h-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
                    </div>

                    <!-- Upload Section -->
                    <div class="flex items-center gap-2">
                        <input type="file"
                            class="flex-1 rounded-xl bg-gray-100 p-2 border cursor-pointer border-gray-300 text-sm"
                            @change="onFileChange" accept="image/jpeg, image/png, image/webp, image/svg+xml" />
                        <button @click="uploadImg" :disabled="!fileImg"
                            :class="[`px-4 py-2  rounded-xl`, fileImg ? `bg-indigo-700 hover:bg-indigo-800` : `bg-indigo-200 hover:bg-indigo-300 cursor-not-allowed`]">
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- ModalImage -->

    </div>
</template>

<script setup>
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs'
import "pdfjs-dist/web/pdf_viewer.css";
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
// Assuming your PlusIcon is correctly imported, but using a placeholder SVG for simplicity above.
import PlusIcon from '@/assets/icons/plus-large-svgrepo-com.svg'
import RotateIcon from '@/assets/icons/bended-arrow-svgrepo-com.svg'
import { mainApi } from '@/api'
import { showNotification } from '../composables/useNotification';
import PdfEditRequestDto from '../stores/editorDto'
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';



// --- STATE MANAGEMENT (Simplified) ---
const route = useRoute();
const pageCount = ref();
const pdfFile = ref();
const activePage = ref(1);
let pdfDoc;
const pages = ref([]);
const fileImg = ref(null)
const uploadProgress = ref(0);
let workSpaceViewport = { width: 1080, height: 720 };
const isDragging = ref(false);
const dragObjectId = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
const workspaceDiv = ref(null);
const isRotating = ref(false);
const rotateObjectId = ref(null);
const initialAngle = ref(0);
const isResizing = ref(false);
const resizeObjectId = ref(null);
const initialSize = ref({ width: 0, height: 0 });
const initialMouse = ref({ x: 0, y: 0 });


const getAssetUrl = (assetId) => {
    const asset = assetLibrary.value.find(a => a.id === assetId);
    return asset ? asset.url : ''; // Kembalikan URL jika ditemukan, kosong jika tidak
};


const startResize = (e, objectId) => {
    e.preventDefault();
    isResizing.value = true;
    resizeObjectId.value = objectId;
    const obj = objects.value.find(o => o.id === objectId);
    if (obj && workspaceDiv.value) {
        const rect = workspaceDiv.value.getBoundingClientRect();
        initialSize.value = { width: obj.width, height: obj.height };
        initialMouse.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', stopResize);
};

const onResize = (e) => {
    if (!isResizing.value || !workspaceDiv.value) return;
    const obj = objects.value.find(o => o.id === resizeObjectId.value);
    if (obj) {
        const rect = workspaceDiv.value.getBoundingClientRect();
        const deltaX = e.clientX - rect.left - initialMouse.value.x;
        const deltaY = e.clientY - rect.top - initialMouse.value.y;
        const newWidth = Math.max(50, initialSize.value.width + deltaX); // Min width 50px
        const newHeight = Math.max(50, initialSize.value.height + deltaY); // Min height 50px
        updateObjectTransform(resizeObjectId.value, { width: newWidth, height: newHeight });
    }
};

const stopResize = () => {
    isResizing.value = false;
    resizeObjectId.value = null;
    window.removeEventListener('mousemove', onResize);
    window.removeEventListener('mouseup', stopResize);
};

const startRotate = (e, objectId) => {
    e.preventDefault();
    isRotating.value = true;
    rotateObjectId.value = objectId;
    const obj = objects.value.find(o => o.id === objectId);
    if (obj && workspaceDiv.value) {
        const rect = workspaceDiv.value.getBoundingClientRect();
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        initialAngle.value = Math.atan2(mouseY - centerY, mouseX - centerX) - (obj.rotation * Math.PI / 180);
    }
    window.addEventListener('mousemove', onRotate);
    window.addEventListener('mouseup', stopRotate);
};

const onRotate = (e) => {
    if (!isRotating.value || !workspaceDiv.value) return;
    const obj = objects.value.find(o => o.id === rotateObjectId.value);
    if (obj) {
        const rect = workspaceDiv.value.getBoundingClientRect();
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
        const newRotation = (angle - initialAngle.value) * (180 / Math.PI);
        updateObjectTransform(rotateObjectId.value, { rotation: newRotation });
    }
};

const stopRotate = () => {
    isRotating.value = false;
    rotateObjectId.value = null;
    selectedObjectId = null;
    window.removeEventListener('mousemove', onRotate);
    window.removeEventListener('mouseup', stopRotate);
};

const startDrag = (e, objectId) => {
    if (!workspaceDiv.value) return;
    e.preventDefault();
    selectObject(objectId);
    isDragging.value = true;
    dragObjectId.value = objectId;
    const rect = workspaceDiv.value.getBoundingClientRect();
    const obj = objects.value.find(o => o.id === objectId);
    if (obj) {
        dragOffset.value.x = e.clientX - rect.left - obj.x;
        dragOffset.value.y = e.clientY - rect.top - obj.y;
    }
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value || !workspaceDiv.value) return;
    const rect = workspaceDiv.value.getBoundingClientRect();
    const rawX = e.clientX - rect.left - dragOffset.value.x;
    const rawY = e.clientY - rect.top - dragOffset.value.y;
    // Batasi agar tidak keluar dari workspaceDiv
    const clampedX = Math.max(0, Math.min(rawX, rect.width - 100)); // Asumsi width objek 100px
    const clampedY = Math.max(0, Math.min(rawY, rect.height - 100)); // Asumsi height objek 100px
    updateObjectTransform(dragObjectId.value, { x: clampedX, y: clampedY });
};

const stopDrag = () => {
    isDragging.value = false;
    dragObjectId.value = null;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
};

const updateDotPosition = (e) => {
    if (!workspaceDiv.value) return;
    const rect = workspaceDiv.value.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    placement.value.dotPosition.x = Math.max(0, Math.min(rawX, rect.width));
    placement.value.dotPosition.y = Math.max(0, Math.min(rawY, rect.height));
};

const confirmPlacement = () => {
    const newObject = {
        id: Date.now(),
        type: placement.value.mode,
        x: placement.value.dotPosition.x, // Sekarang relatif terhadap workspace
        y: placement.value.dotPosition.y, // Sekarang relatif terhadap workspace
        width: 100,
        height: 100,
        rotation: 0,
        pageNumber: activePage.value,
        props: {}
    };
    if (newObject.type === 'text') {
        newObject.props = { content: 'New Text Block', fontSize: 14 };
    } else if (newObject.type === 'image') {
        newObject.props = { assetId: placement.value.selectedAssetId, opacity: 100 };
    }
    objects.value.push(newObject);
    selectObject(newObject.id); // Select the new object immediately
    cancelPlacement(); // Exit placement mode
    console.log(`Object placed: ${newObject.type}`);
};



// const pages = ref([{
//     id: null,
//     pageNumber: null,
//     data: null
// }
//     // Dummy data for structure
//     // { id: 1, thumbnailUrl: 'url1', pageNumber: 1, url: '' },
//     // { id: 2, thumbnailUrl: 'url2', pageNumber: 2, url: '' },
//     // { id: 3, thumbnailUrl: 'url3', pageNumber: 3, url: '' },
//     // { id: 4, thumbnailUrl: 'url4', pageNumber: 4, url: '' },
//     // { id: 5, thumbnailUrl: 'url5', pageNumber: 5, url: '' },
//     // ... more pages
// ]);

const deleteImg = async () => {
    const id = placement.value.selectedAssetId
    const confirmDelete = confirm(`Yakin menghapus asset? ${id}`)
    if (confirmDelete) {
        await mainApi.delete(`files/${id}`);
        assetLibrary.value = assetLibrary.value.filter(a => a.id !== id);
        placement.value.selectedAssetId = null;
    }
}
const uploadImg = async () => {
    if (!fileImg.value) return;

    let interval = null; // <-- pindahkan ke sini

    try {
        const formData = new FormData();
        formData.append('file', fileImg.value);

        uploadProgress.value = 1;

        // Progress animation dummy (karena axios tidak ada onUploadProgress di fetch)
        interval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value++;
            }
        }, 80);

        const res = await mainApi.post(`files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Jika sukses → langsung 100%
        uploadProgress.value = 100;

        setTimeout(() => {
            uploadProgress.value = 0;
        }, 500);
        await loadLibrary();
    } catch (e) {
        showNotification('error', 'Gagal upload gambar');
        uploadProgress.value = 0;

    } finally {
        if (interval) clearInterval(interval);
        fileImg.value = null;
    }
}


const onFileChange = (event) => {
    fileImg.value = event.target.files[0];
}


watch(activePage, async () => {
    await setWorkSpace(activePage.value)
})

const setWorkSpace = async (pageNum) => {
    const page = await pdfDoc.getPage(pageNum);
    const pageViewport = page.getViewport({ scale: 1 });
    const canvas = document.getElementById('work-space')
    const context = canvas.getContext('2d');
    const outputScale = window.devicePixelRatio || 1;

    canvas.width = Math.floor(pageViewport.width * outputScale);
    canvas.height = Math.floor(pageViewport.height * outputScale);

    canvas.style.width = `${Math.floor(pageViewport.width)}px`;
    canvas.style.height = `${Math.floor(pageViewport.height)}px`;
    workSpaceViewport.width = canvas.style.width;
    workSpaceViewport.height = canvas.style.height;

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
    await page.render({ canvasContext: context, viewport: pageViewport, transform }).promise;
}
const loadPDF = async () => {
    const id = route.query.fileId;
    const res = await mainApi.get(`/files/${id}`, { responseType: 'arraybuffer' });
    pdfDoc = await pdfjsLib.getDocument({ data: res.data }).promise;
    const numPages = pdfDoc.numPages;


    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);

        const scale = 0.3;
        const viewport = page.getViewport({ scale });
        const outputScale = window.devicePixelRatio || 1;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        await page.render({ canvasContext: context, viewport, transform }).promise;

        pages.value.push({
            id: i,
            pageNumber: i,
            canvas
        });
    }

    activePage.value = 1;
};

onMounted(() => {
    loadPDF().then(async () => {
        pages.value.forEach(page => {
            const container = document.querySelector(`[aria-label="Page ${page.pageNumber}"] div`);
            container.appendChild(page.canvas);
        });
        await setWorkSpace(activePage.value);
    });

});


const fab = ref({ enabled: false });
const selectedObjectId = ref(null);

const loadLibrary = async () => {
    const res = await mainApi.get('files?type=image');
    const ids = []
    ids.push(...res.data.map(data => data.id_file))
    ids.forEach(async id => {
        if (!assetLibrary.value.some(item => item.id === id)) {
            const dataImg = await mainApi.get(`files/${id}`, { responseType: 'arraybuffer' });
            const blob = new Blob([dataImg.data], { type: "image/png" })
            const url = URL.createObjectURL(blob);
            assetLibrary.value.push({ id, url, name: `asset${id}` })
        }
    })
}

const assetLibrary = ref([
]);

const placement = ref({
    mode: null, // 'asset_select' | 'image' | 'text' | 'qr' | null
    selectedAssetId: null,
    dotPosition: { x: 0, y: 0 },
});

const objects = ref([
    { id: 1001, type: 'text', x: 100, y: 100, width: 200, height: 50, rotation: 0, pageNumber: 1, props: { content: 'Editable Text', fontSize: 16 } },
    { id: 1002, type: 'image', x: 400, y: 300, width: 100, height: 100, rotation: 15, pageNumber: 1, props: { assetId: 101, opacity: 100 } },
]);

// Computed Properties
const activePageData = computed(() => pages.value.find(p => p.pageNumber === activePage.value));
const selectedObject = computed(() => objects.value.find(obj => obj.id === selectedObjectId.value));
const dotPosition = computed(() => placement.value.dotPosition);


// --- METHODS ---

/** 1. Pages Panel Actions */
const selectPage = (pageNumber) => {
    activePage.value = pageNumber;
    selectedObjectId.value = null; // Deselect object on page change
    console.log(`Page ${pageNumber} selected.`);
};

/** 2. FAB Actions */
const activateFab = () => {
    fab.value.enabled = true;
    console.log('FAB Activated.');
};

/** 3. Asset Selector / Placement Flow Actions */
const openAssetSelector = async () => {
    if (fab.value.enabled) {
        placement.value.mode = 'asset_select';
        placement.value.selectedAssetId = null; // Reset selection
        console.log('Asset Selector Opened.');
        await loadLibrary();
    }
};

const selectAsset = (assetId) => {
    placement.value.selectedAssetId = assetId;
    console.log(`Asset ${assetId} selected.`);
};

const startPlacement = (mode, assetId = null) => {
    if (!fab.value.enabled) return;

    if (mode === 'image' && !assetId) {
        // This happens after selecting an image in the asset selector
        placement.value.mode = 'image';
        placement.value.selectedAssetId = placement.value.selectedAssetId;
        // Close modal if open
        // placement.value.mode = mode; // Asset selector modal will close itself implicitly
    } else if (mode === 'image') {
        // Called from modal CTA
        placement.value.mode = mode;
        placement.value.selectedAssetId = assetId;
    } else {
        // For QR or Text, immediately enter placement mode
        placement.value.mode = mode;
        placement.value.selectedAssetId = null; // Not asset-based
    }

    // Close the asset selector if it was open
    if (placement.value.mode !== 'asset_select') {
        // A better way to handle the modal would be a separate v-model state.
        console.log(`Entering placement mode: ${placement.value.mode}`);
    }
};


const cancelPlacement = () => {
    placement.value.mode = null;
    placement.value.selectedAssetId = null;
    fileImg.value = null;
    selectedObjectId.value = null;
    if (document.activeElement) document.activeElement.blur();
    console.log('Placement cancelled.');
};

const selectObject = (objectId) => {
    selectedObjectId.value = objectId;
    console.log(`Object ${objectId} selected.`);
};

const deleteObject = (objectId) => {
    objects.value = objects.value.filter(obj => obj.id !== objectId);
    selectedObjectId.value = null;
    console.log(`Object ${objectId} deleted.`);
};

const updateObjectTransform = (objectId, newTransform) => {
    const obj = objects.value.find(o => o.id === objectId);
    if (obj) {
        Object.assign(obj, newTransform);
    }
};

const updateProperty = (objectId, property, value) => {
    const obj = objects.value.find(o => o.id === objectId);
    if (obj && obj.props) {
        obj.props[property] = property === 'fontSize' ? Number(value) : value;
    }
};


// onMounted(async() => {
//     await loadPdf();
// })

// onMounted(() => {
//   // Your existing PDF loading logic goes here
//   // For now, using dummy data.
// });
</script>

<style scoped>
/* Custom utility for better scrollbar on hover */
.scrollbar-thin {
    scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
    width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-gray-400 rounded-full;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500;
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
    background: transparent;
}
</style>