<template>
    <div class="fixed inset-0 flex bg-gray-50 overflow-hidden">
        <!-- SidePreview -->
        <div
            class="flex flex-col w-24 relative h-full group transition-all duration-300 ease-in-out hover:w-60 bg-white shadow-xl z-20">
            <router-link to="/input-file" @mouseenter="onHover = false" @mouseleave="onHover = true">
                <div class="h-16 flex items-center justify-center p-2 border-b">
                    <span v-if="!onHover"
                        class="text-lg font-semibold text-blue-600 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-hover:delay-150">
                        <HomeIcon class="w-6 h-6 text-black" />
                    </span>
                    <span v-if="onHover"
                        class="text-lg font-semibold text-blue-600 transition-opacity duration-300 opacity-100 group-hover:opacity-0 group-hover:delay-150">
                        <LeftArrow class="w-6 h-6  text-white" />
                    </span>
                </div>
            </router-link>

            <div
                class="flex flex-col items-center gap-4 py-4 hover:overflow-y-scroll scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-100">
                <button v-for="(page, index) in pages" :key="index" :aria-label="`Page ${page.pageNumber}`"
                    :aria-pressed="activePage === page.pageNumber" @click="selectPage(page.pageNumber)" :class="[
                        'relative w-[90%] shrink-0 rounded-lg shadow-md transition overflow-hidden duration-200 ease-in-out',
                        activePage === page.pageNumber
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:scale-[1.03] hover:shadow-lg', pageTemplate.includes(page.pageNumber, 0) ? 'ring-2 ring-green-500 bg-blue-50' : '',
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

            <div class="absolute flex bottom-0 w-full p-2 bg-white border-t shadow-inner gap-2">
                <!-- Button Select All -->
                <button @click="handleSelectAll" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors
               bg-gray-100 text-gray-700 hover:bg-gray-200 
               focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Select All
                </button>

                <!-- Button Template -->
                <button @click="setTemplate" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors"
                    :class="pageTemplate.includes(activePage, 0)
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'">
                    {{ pageTemplate.includes(activePage, 0) ? 'Remove Template' : 'Set as Template' }}
                </button>
            </div>

        </div>


        <!-- WorkSpace -->
        <div class="flex-1 flex flex-col items-center relative overflow-auto bg-transparent">
            <ControlPanel v-if="showControlPanel" @property="handlePropertyControlPanel" :isLoading="isLoading1"
                :prop="selectedObject.props" />
            <div class="relative w-full h-full flex  items-center justify-center p-8 overflow-auto">

                <div ref="workspaceDiv" class="shadow-2xl border bg-white relative">
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
                    }" @mousedown="handleObjectMouseDown($event, object)"
                        @keydown.backspace="deleteObject(selectedObjectId)" :class="[
                            'cursor-move border border-dashed transition-all duration-100',
                            selectedObjectId === object.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                        ]">
                        <div class="w-full h-full flex items-center justify-center text-xs">
                            <!-- Jika type 'text', tampilkan teks -->
                            <span v-if="object.type === 'text'">
                                <!-- Mode view -->
                                <span v-if="editingObjectId !== object.id" :style="getTextStyle(object.props)"
                                    class="text-black" @dblclick="handleInputText(object)">
                                    {{ object.props.content }}
                                </span>

                                <!-- Mode edit -->
                                <input v-else :id="`input-${object.id}`" type="text" v-model="object.props.content"
                                    :style="getTextStyle(object.props)"
                                    class="w-full h-full text-black z-50 text-center outline-none bg-transparent border-none"
                                    @blur="finishEdit(object)" @keydown.enter="handleEnter($event, object)" />
                            </span>
                            <img v-else-if="object.type === 'image'" :src="getAssetUrl(object.props.assetId)"
                                :alt="`Asset ${object.props.assetId}`" class="w-full h-full object-cover" />
                            <span v-else>{{ object.type }} Object #{{ object.id }}</span>
                        </div>
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
                                    Add Field
                                </span>
                            </li>
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
            <div
                class="w-40 h-full bg-white shadow-xl z-20 transition-all duration-300 overflow-y-auto p-4 border-l flex flex-col">
                <h3 class="text-lg font-bold text-black mb-4"></h3>

                <div v-if="selectedObjectId">
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700">Orientation</label>
                        <input type="number" :value="Math.floor(selectedObject.rotation)" @input="updateObjectTransform(selectedObjectId, {
                            rotation: Math.min(360, Math.max(0, Number($event.target.value)))
                        })" class=" mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700">X Coordinate</label>
                        <input type="number" :value="Math.floor(selectedObject.x)"
                            @input="updateObjectTransform(selectedObjectId, { x: $event.target.value })"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700">Y Coordinate</label>
                        <input type="number" :value="Math.floor(selectedObject.y)"
                            @input="updateObjectTransform(selectedObjectId, { y: $event.target.value })"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700">Height</label>
                        <input type="number" :value="Math.floor(selectedObject.height)"
                            @input="updateObjectTransform(selectedObjectId, { height: $event.target.value })"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700">Width</label>
                        <input type="number" :value="Math.floor(selectedObject.width)"
                            @input="updateObjectTransform(selectedObjectId, { width: $event.target.value })"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div class="mt-4">
                        <button @click="deleteObject(selectedObjectId)"
                            class="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Delete Object
                        </button>
                    </div>

                </div>
                <button @click="render" :disabled="isLoadingRender"
                    class="mt-auto h-10 px-5 bg-blue-800 text-white hover:bg-blue-500 active:bg-blue-900 rounded-full cursor-pointer">
                    <span v-if="!isLoadingRender" class="font-bold">RENDER</span>
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


                <h3 class="text-2xl font-semibold mb-5 text-gray-800">Select Image Asset</h3>
                <div class="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
                    <div v-for="asset in assetLibrary" :key="asset.id" @click="placement.selectedAssetId = asset.id"
                        :class="[
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
                    = <div class="flex gap-5">
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
import { onMounted, ref, computed, watch, nextTick, reactive, onBeforeUnmount } from 'vue';
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs'
import "pdfjs-dist/web/pdf_viewer.css";
import { useRoute } from 'vue-router';
import PlusIcon from '@/assets/icons/plus-large-svgrepo-com.svg'
import LeftArrow from '@/assets/icons/left-arrow-svgrepo-com.svg'
import Home from '@/assets/icons/home-smile-svgrepo-com.svg'
import RotateIcon from '@/assets/icons/bended-arrow-svgrepo-com.svg'
import { mainApi } from '@/api'
import { showNotification } from '../composables/useNotification';
import { usePdfEditRequestStore } from '../stores/requestEditorStore';
import { HomeIcon } from 'lucide-vue-next';
import ControlPanel from '../components/EditorComponents/ControlPanel.vue';
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

// --- STATE MANAGEMENT (Simplified) ---
const onHover = ref(true)
const DtoEditorStore = usePdfEditRequestStore();
const route = useRoute();
const pageCount = ref();
const pdfFile = ref();
const activePage = ref(1);
const canvasHeight = ref(0);
let pdfDoc;
const pages = ref([]);
const fileImg = ref(null)
const uploadProgress = ref(0);
const workSpaceViewport = ref({ width: 1080, height: 720 });
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
const newObject = ref([
    { id: 0, type: 'field', x: 0, y: 0, }
])
const assetLibrary = ref([]);
const editingObjectId = ref(null);
const isLoadingRender = ref(false)
const isLoading2 = ref(false);

const mouseDrag = ref({ x: 0, y: 0 });
const placement = ref({
    mode: 'asset_select' | 'text' | 'image' | 'field' | 'qr' | null,
    selectedAssetId: null,
    dotPosition: { x: 0, y: 0 },
});
const showControlPanel = ref(false);
const propertyControlPanel = ref();
const selectedObject = computed(() => objects.value.find(obj => obj.id === selectedObjectId.value));
const dotPosition = computed(() => placement.value.dotPosition);

const pdfId = ref(route.query.fileId);
const pageTemplate = ref([]);
const objects = ref([
    // { id: 1001, type: 'text', x: 100, y: 100, width: 200, height: 50, rotation: 0, pageNumber: 1, props: { font: 'Arial', content: 'testtt', fontSize: 16, isBold: false, isItalic: false, isUnderline: false, color: { r: 0, g: 0, b: 0 } } },
    // { id: 1002, type: 'image', x: 400, y: 500, width: 100, height: 100, rotation: 15, pageNumber: 1, props: { font: 'Arial', content: 'testtt', fontSize: 16, isBold: false, isItalic: false, isUnderline: false, color: { r: 0, g: 0, b: 0 } } },
]);


watch(pageTemplate.value, (event) => {
    console.log(pageTemplate.value)
})

const handlePropertyControlPanel = async (event) => {
    propertyControlPanel.value = event
}

const handleObjectMouseDown = (event, object) => {
    if (editingObjectId.value === object.id) {
        return;
    }
    event.preventDefault();
    selectObject(object);
    startDrag(event, object.id);
};

const getTextStyle = (props) => {
    if (!props) return {};

    return {
        // Mapping font family
        fontFamily: props.font,
        // Mapping font size
        fontSize: `${props.fontSize}px`,
        // Mapping styles boolean
        fontWeight: props.isBold ? 'bold' : 'normal',
        fontStyle: props.isItalic ? 'italic' : 'normal',
        textDecoration: props.isUnderline ? 'underline' : 'none',
        // Mapping warna dari object {r,g,b} ke string rgb()
        color: `rgb(${props.color.r}, ${props.color.g}, ${props.color.b})`,
        // Pastikan input text background transparan agar menyatu
        backgroundColor: 'transparent'
    };
};

onMounted(async () => {
    console.log(pageTemplate.value)
    window.addEventListener("keydown", handleKeyDown);
    isLoading2.value = true;
    try {
        await loadPDF();
        const previewScale = 1;
        pages.value.forEach(page => {
            const container = document.querySelector(`[aria-label="Page ${page.pageNumber}"] div`);
            container.appendChild(page.canvas);
            page.canvas.style.width = "100%";
            page.canvas.style.height = "100%";
            page.canvas.style.objectFit = "contain";
        });
        await setWorkSpace(activePage.value);
        canvasHeight.value = workspaceDiv.value.getBoundingClientRect();
    } catch (e) {
        showNotification('warning', e.message);
    } finally {
        isLoading2.value = false;
    }
});

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
    workSpaceViewport.value.width = canvas.style.width;
    workSpaceViewport.value.height = canvas.style.height;

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
    await page.render({ canvasContext: context, viewport: pageViewport, transform }).promise;
}

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
});

watch(activePage, async () => {
    await setWorkSpace(activePage.value)
})

function handleKeyDown(e) {
    if (!selectedObjectId) return;
    if (selectedObject?.value?.type == 'text') return;
    if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteObject(selectedObjectId.value);
    }
}

const selected = ref("")

const menuItems = [
    "",
    "Duplicate",
    "Archive",
    "Move",
    "Share",
    "Add to favorites",
    "Delete"
]

const translateToScreen = (y, height) => {
    return canvasHeight.value.height - y + 590;
};


const handleInputText = (object) => {
    if (object.type !== 'text') return;
    editingObjectId.value = object.id;

    nextTick(() => {
        const el = document.getElementById(`input-${object.id}`);
        el?.focus();
    });
};

const finishEdit = () => {
    editingObjectId.value = null;
};

const handleEnter = (e, object) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        finishEdit(object);
    }
};
const pdfFileName = ref()
const renderOption = ref()
const tableSelected = ref() 

const formConfiguration = reactive({
    pdfFileName:'',
    renderOption:'',
    tableSelected:'',
})


const render = async () => {
    isLoadingRender.value = true
    DtoEditorStore.init();
    const configuration = {
        "pdfId": pdfId.value,
        "pdfFileName": formConfiguration.pdfFileName,
        "editOption": formConfiguration.renderOption,
        "renderOption": {
            "saveToDb": true,
            "insertMode": true
        }
    }

    // DtoEditorStore.
    try {
        const json = DtoEditorStore.showDto();
        console.log(JSON.stringify(json))
        // const res = await mainApi.post('editor/render', json);
        showNotification('success', `Render Berhasil, cek pada file manager`)
    } catch (error) {
        showNotification('error', `Terjadi kesalahan render: ${error.message}`)
        console.log(error)
    } finally {
        isLoadingRender.value = false
    }
}


const loadPDF = async () => {
    const res = await mainApi.get(`/files/${pdfId.value}`, { responseType: 'arraybuffer' });
    pdfDoc = await pdfjsLib.getDocument({ data: res.data }).promise;
    DtoEditorStore.setPdfId(pdfId.value)
    const numPages = pdfDoc.numPages;
    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);

        const scale = 1;
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


const uploadImg = async () => {
    if (!fileImg.value) return;
    let interval = null;
    try {
        const formData = new FormData();
        formData.append('file', fileImg.value);
        uploadProgress.value = 1;

        interval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value++;
            }
        }, 80);

        const res = await mainApi.post(`files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
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

const deleteImg = async () => {
    const id = placement.value.selectedAssetId
    const confirmDelete = confirm(`Yakin menghapus asset? ${id}`)
    if (confirmDelete) {
        await mainApi.delete(`files/${id}`);
        assetLibrary.value = assetLibrary.value.filter(a => a.id !== id);
        placement.value.selectedAssetId = null;
    }
}


const onFileChange = (event) => {
    fileImg.value = event.target.files[0];
}

const getAssetUrl = (assetId) => {
    const asset = assetLibrary.value.find(a => a.id === assetId);
    return asset ? asset.url : '';
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
    selectedObjectId.value = null;;
    window.removeEventListener('mousemove', onRotate);
    window.removeEventListener('mouseup', stopRotate);
};

const startDrag = (e, objectId) => {
    if (!workspaceDiv.value) return;
    e.preventDefault();
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
    const height = window.visualViewport.height;
    mouseDrag.value.y = height - e.clientY;
    const mouseY = height - e.clientY;
    const rect = workspaceDiv.value.getBoundingClientRect();
    const rawX = e.clientX - rect.left - dragOffset.value.x;
    const rawY = e.clientY - rect.top - dragOffset.value.y;
    const clampedX = Math.max(0, Math.min(rawX, rect.width - 100));
    const clampedY = Math.max(0, Math.min(rawY, rect.height - 100));
    mouseDrag.value.x = rawY;
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


const selectPage = (pageNumber) => {
    fab.value.enabled = pageTemplate.value.includes(pageNumber, 0)
    activePage.value = pageNumber;
    selectedObjectId.value = null;
    console.log(`Page ${pageNumber} selected.`);
};

const setTemplate = () => {
    if (!pageTemplate.value.includes(activePage.value)) {
        pageTemplate.value.push(activePage.value)
        fab.value.enabled = true;
        return
    }
    const confirmation = confirm('yakin hapus template?')
    if (confirmation) {
        const index = pageTemplate.value.findIndex((e) => e === activePage.value)
        pageTemplate.value.splice(index, 1);
        fab.value.enabled = false;
    }
    console.log('FAB Activated.', pageTemplate.value);
};

const openAssetSelector = async () => {
    if (fab.value.enabled) {
        placement.value.mode = 'asset_select';
        placement.value.selectedAssetId = null; // Reset selection
        console.log('Asset Selector Opened.');
        await loadLibrary();
    }
};

const startPlacement = (mode, assetId = null) => {
    if (!fab.value.enabled) return;

    if (mode === 'image' && !assetId) {
        placement.value.mode = 'image';
        placement.value.selectedAssetId = placement.value.selectedAssetId;
    } else if (mode === 'image') {
        placement.value.mode = mode;
        placement.value.selectedAssetId = assetId;
    } else {
        placement.value.mode = mode;
        placement.value.selectedAssetId = null; // Not asset-based
    }

    if (placement.value.mode !== 'asset_select') {
        console.log(`Entering placement mode: ${placement.value.mode}`);
    }
};

const confirmPlacement = () => {
    const newObject = {
        id: Date.now(),
        type: placement.value.mode,
        x: placement.value.dotPosition.x,
        y: placement.value.dotPosition.y,
        width: 100,
        height: 100,
        rotation: 0,
        pageNumber: activePage.value,
        props: {}
    }
    if (newObject.type === 'text') {
        newObject.props = { font: 'Arial', content: 'TextField', fontSize: 16, isBold: false, isItalic: false, isUnderline: false, color: { r: 0, g: 0, b: 0 } };
    } else if (newObject.type === 'image') {
        newObject.props = { assetId: placement.value.selectedAssetId, opacity: 100 };
    }
    objects.value.push(newObject);
    selectObject(newObject);
    cancelPlacement();
    console.log(`Object placed: ${newObject.type}`);
};


const cancelPlacement = () => {
    placement.value.mode = null;
    placement.value.selectedAssetId = null;
    fileImg.value = null;
    selectedObjectId.value = null;
    if (document.activeElement) document.activeElement.blur();
    showControlPanel.value = false;
    console.log('Placement cancelled.');
};

const selectObject = (object) => {
    if (object.type == 'text') {
        showControlPanel.value = true;
    }
    selectedObjectId.value = object.id;
    console.log(`Object ${object.id} selected.`);
};

const deleteObject = (objectId) => {
    objects.value = objects.value.filter(obj => obj.id !== objectId);
    selectedObjectId.value = null;
    console.log(objectId);
};

const updateObjectTransform = (objectId, newTransform) => {
    const obj = objects.value.find(o => o.id === objectId);
    if (obj) {
        Object.assign(obj, newTransform);
    }
};
</script>

<style scoped>
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
