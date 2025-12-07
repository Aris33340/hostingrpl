<template>
    <div class="fixed inset-0 flex bg-gray-50 overflow-hidden">
        <!-- SidePreview -->
        <div @mouseenter="onHover = false" @mouseleave="onHover = true"
            class="flex flex-col w-24 relative h-full group transition-all duration-300 ease-in-out hover:w-60 bg-white shadow-xl z-20">
            <router-link to="/input-file">
                <div class="h-16 flex items-center justify-center p-2 border-b">
                    <span v-if="!onHover"
                        class="text-lg font-semibold text-black transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-hover:delay-150">
                        <HomeIcon class="w-6 h-6" />
                    </span>
                    <span v-if="onHover"
                        class="text-lg font-semibold text-black transition-opacity duration-300 opacity-100 group-hover:opacity-0 group-hover:delay-150">
                        <LeftArrow class="w-6 h-6" />
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

            <div v-if="!onHover" class="absolute flex bottom-0 w-full p-2 bg-white border-t shadow-inner gap-2">
                <!-- Button Select All -->
                <!-- <button @click="handleSelectAll" class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors
               bg-gray-100 text-gray-700 hover:bg-gray-200 
               focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Select All
                </button> -->

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
            <ControlPanel v-if="showControlPanel" @property="handlePropertyControlPanel" :prop="selectedObject.props" />
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

                    <!-- workspace canvas -->
                    <canvas id="work-space" @click.stop="cancelPlacement" class="bg-blue-200 w-full h-full">
                    </canvas>

                    <!-- objects -->
                    <div v-for="object in objects" :key="object.id" :style="{
                        left: `${object.x}px`,
                        top: `${object.y}px`,
                        width: `${object.width}px`,
                        height: `${object.height}px`,
                        transform: `rotate(${object.rotation}deg)`,
                        position: 'absolute',
                    }" @mousedown="handleObjectMouseDown($event, object)" :class="[
                        'cursor-move border border-dashed transition-all duration-100',
                        selectedObjectId === object.id ? 'border-blue-500' : 'border-transparent hover:border-red-300'
                    ]">
                        <div v-if="object.pageNumber == activePage"
                            class="w-full h-full flex items-center justify-center">
                            <!-- Jika type 'text', tampilkan teks -->
                            <span v-if="object.type === 'text'">
                                <!-- Mode view -->
                                <span v-if="editingObjectId !== object.id" :style="getTextStyle(object.props)"
                                    class="absolute left-1 -top-1 flex items-start justify-start text-left" @dblclick="handleInputText(object)">
                                    {{ object.props.content }}
                                </span>

                                <!-- Mode edit -->
                                <input v-else :id="`input-${object.id}`" type="text" v-model="object.props.content"
                                    :style="getTextStyle(object.props)"
                                    class="w-full h-full z-50 text-center outline-none bg-transparent border-none"
                                    @blur="finishEdit(object)" @keydown.enter="handleEnter($event, object)" />
                            </span>
                            <img v-else-if="object.type === 'image'" :src="getAssetUrl(object.props.assetId)"
                                :alt="`Asset ${object.props.assetId}`" class="w-full h-full object-cover" />

                            <img v-else-if="object.type == 'qr'" :src="qrSampleUrl.url" :alt="`${qrSampleUrl.name}`"
                                class="w-full h-full object-cover" />

                            <span v-else-if="object.type === 'field'" :style="getTextStyle(object.props)"
                                class="absolute left-0 top-0">
                                {{ object.props.content }}
                            </span>

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
            </div>
        </div>
        <!-- WorkSpace -->

        <!-- Right Control Bar -->
        <div class="h-full bg-transparent transition-all duration-300 flex flex-row">
            <!--add object container -->
            <div class="relative flex flex-col overflow-visible">
                <div class="flex-1 bg-transparent"></div>
                <div @mouseleave="field.enabled = false" class="m-5 group overflow-visible">
                    <div class="flex">
                        <!-- main (add field bar) -->
                        <transition enter-active-class="transition-all duration-300 ease-out"
                            enter-from-class="opacity-0 -translate-y-2 scale-95"
                            enter-to-class="opacity-100 translate-y-0 scale-100"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 translate-y-0 scale-100"
                            leave-to-class="opacity-0 -translate-y-2 scale-95">
                            <div v-if="field.enabled" class="flex flex-col">
                                <div :class="['text-white w-7 h-7 rounded-full shadow-xl transition-all duration-300 ease-out overflow-visible', field.enabled ? 'opacity-100 pointer-events-auto group-hover:w-36 group-hover:rounded-full' : 'opacity-0 pointer-events-none', 'flex flex-col items-center justify-center']"
                                    :title="!fab.enabled ? 'Set as template to enable' : 'Add Content'" tabindex="0">
                                    <ul
                                        :class="['w-full h-full flex flex-row items-center gap-3 px-3 opacity-0 transition-opacity duration-300 delay-150 overflow-visible', fab.enabled ? 'group-hover:opacity-100' : 'opacity-0']">
                                        <li v-for="(item, i) in fieldSampleTypes" :key="i" class="relative group/item">
                                            <button
                                                @click="() => { fieldSampleType = fieldSampleType == item.id ? null : item.id }"
                                                :disabled="item.disabled"
                                                :class="[fieldSampleType == item.id ? 'bg-blue-600' : 'bg-white', 'w-5 h-5 rounded-full shadow-md hover:scale-110 transition-transform']">
                                                <component :is="item.icon" class="w-4 h-4 m-auto" />
                                            </button>
                                            <span role="tooltip"
                                                class="absolute bottom-full -left-4 mb-3 py-1 px-1 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 pointer-events-auto z-50">
                                                {{ item.tooltip }}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <DropDown :title="'Pilih Kolom'" :items="tableFields"
                                    @select="(event) => { tableFieldSelected = event }"
                                    :selected="tableFieldSelected" />
                                <button :disabled="!(tableFieldSelected && fieldSampleType)"
                                    @click="startPlacement('field')"
                                    :class="[tableFieldSelected && fieldSampleType ? 'bg-blue-600' : 'bg-gray-600', 'w-full h-10  text-white flex items-center justify-center rounded-lg hover:scale-105 duration-300 transition-all']">
                                    <IconPlus class="w-6 h-6" />
                                </button>
                            </div>
                        </transition>

                        <!-- main (add component bar) -->
                        <div :class="['relative ml-auto bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl transition-all duration-300 ease-out overflow-visible', fab.enabled ? 'opacity-100 pointer-events-auto group-hover:h-72 group-hover:rounded-2xl' : 'opacity-40 pointer-events-none', 'flex flex-col items-center justify-center']"
                            :title="!fab.enabled ? 'Set as template to enable' : 'Add Content'" tabindex="0">

                            <div
                                :class="['absolute transition-opacity duration-100', fab.enabled ? 'group-hover:opacity-0' : '']">
                                <IconPlus class="w-12 h-12 m-auto" />
                            </div>

                            <ul
                                :class="['w-full h-full flex flex-col justify-evenly items-center opacity-0 transition-opacity duration-300 delay-150 overflow-visible', fab.enabled ? 'group-hover:opacity-100' : 'opacity-0']">
                                <!-- BUTTON: Add Field -->
                                <li class="relative group/component w-full">
                                    <div
                                        class="absolute top-0 left-0 w-4 h-4 bg-red-700 cursor-pointer  rounded-full z-50 hover:scale-110 ">
                                    </div>

                                    <button @click="field.enabled = !field.enabled"
                                        :class="[field.enabled ? 'bg-gray-400' : 'bg-white', 'w-10 h-10 rounded-full text-blue-600 shadow-md hover:scale-110 transition-transform']">
                                        <TextField class="w-6 h-6 m-auto" />
                                    </button>
                                    <span role="tooltip"
                                        class="absolute left-full ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover/component:opacity-100 transition-opacity duration-150 pointer-events-auto z-50">
                                        Tambah field
                                    </span>
                                </li> <!-- BUTTON: Disabled QR -->
                                <li class="relative group/component w-full">
                                    <div
                                        class="absolute top-0 left-0 w-4 h-4 bg-yellow-700 cursor-pointer  rounded-full z-50 hover:scale-110 ">
                                    </div>

                                    <button @click="startPlacement('qr')" aria-label="Add QR"
                                        class="w-10 h-10 rounded-full bg-white text-blue-600 shadow-md hover:scale-110 transition-transform">
                                        <QrIcon class="w-6 h-6 m-auto" />
                                    </button>
                                    <span role="tooltip"
                                        class="absolute left-full ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover/component:opacity-100 transition-opacity duration-150 pointer-events-auto z-50">
                                        Tambah QR
                                    </span>
                                </li> <!-- BUTTON: Text -->
                                <li class="relative group/component">
                                    <button @click="startPlacement('text')" aria-label="Add Text"
                                        class="w-10 h-10 rounded-full bg-white text-blue-600 shadow-md hover:scale-110 transition-transform">
                                        <Text class="w-6 h-6 m-auto" />
                                    </button>
                                    <span role="tooltip"
                                        class="absolute left-full ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover/component:opacity-100 transition-opacity duration-150 pointer-events-auto z-50">
                                        Tambah text
                                    </span>
                                </li> <!-- BUTTON: Add Image -->
                                <li class="relative group/component">
                                    <button @click="openAssetSelector" aria-label="Add Image"
                                        class="w-10 h-10 rounded-full bg-white text-blue-600 shadow-md hover:scale-110 transition-transform">
                                        <IconGallery class="w-6 h-6 m-auto" />
                                    </button>
                                    <span role="tooltip"
                                        class="absolute left-full ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover/component:opacity-100 transition-opacity duration-150 pointer-events-auto z-50">
                                        Tambah gambar
                                    </span>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>
            </div>

            <!-- hide right panel settings button -->
            <button class="bg-gray-100 w-5 m-0 duration-400" @click="showSettings = !showSettings">
                <span class="flex text-black transition-transform duration-300"
                    :class="{ 'rotate-180': !showSettings }">
                    <LeftMiniArrow class="w-8 h-8" />
                </span>
            </button>

            <!-- right panel settings -->
            <transition enter-active-class="transition-all duration-300 ease-in-out"
                enter-from-class="opacity-0 translate-x-5" enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition-all duration-300 ease-in-out"
                leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-x-5">
                <div v-show="showSettings"
                    class="w-56 h-full bg-white shadow-xl z-20 transition-all duration-300 p-4 border-l flex flex-col overflow-visible">
                    <h3 class="text-lg font-bold text-black mb-4">Settings</h3>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipe Hadirin</label>
                        <div class="group">
                            <div class="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                                <button :disabled="isTableTypeSet" @click="tableTypeSelected = 'mahasiswa'" :class="[
                                    'flex-1 text-sm font-medium px-3 transition-colors duration-200',
                                    isTableTypeSet ? 'cursor-not-allowed bg-gray-100 text-gray-500' : '',
                                    tableTypeSelected == 'mahasiswa'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                ]">
                                    Mahasiswa
                                </button>

                                <button :disabled="isTableTypeSet" @click="tableTypeSelected = 'tamu'" :class="[
                                    'flex-1 text-sm font-medium px-3 transition-colors duration-200 border-l border-gray-300',
                                    isTableTypeSet ? 'cursor-move bg-gray-100 text-gray-500' : '',
                                    tableTypeSelected == 'tamu'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                ]">
                                    Non Mahasiswa
                                </button>
                            </div>

                            <div v-if="role == 'BUKUWISUDA' ? false : isTableTypeSet" role="tooltip" :class="[
                                'absolute top-5 left-1/2 mt-2 -translate-x-1/2',
                                'py-2 px-3 bg-red-600 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-50', // Gaya Tooltip
                                'opacity-0 transition-opacity duration-300 pointer-events-none', // Status default tersembunyi
                                'group-hover:opacity-100' // Tampil saat hover pada parent group
                            ]">
                                Hapus semua komponen bertipe field atau qr untuk mengubah tabel
                            </div>
                        </div>
                    </div>
                    <div v-if="selectedObjectId">

                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700">Orientation</label>
                            <input type="number" :value="Math.floor(selectedObject?.rotation)" @input="updateObjectTransform(selectedObjectId, {
                                rotation: Math.min(360, Math.max(0, Number($event.target.value)))
                            })" class=" mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>

                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700">X Coordinate</label>
                            <input type="number" :value="Math.floor(selectedObject?.x)"
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
                                class="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-600">
                                Delete Object
                            </button>
                        </div>
                    </div>
                    <div class="mt-auto gap-2 flex flex-col">
                        <button @click="saveDraft"
                            class="bg-gray-500 w-full h-10 font-bold text-gray-50 rounded-lg hover:bg-gray-400 cursor-pointer transition-colors duration-200">
                            Save Draft
                        </button>
                        <button @click="showConfigModal = true"
                            class="bg-blue-700 w-full h-10 font-bold text-gray-50 rounded-lg hover:bg-blue-400 cursor-pointer transition-colors duration-200">
                            <span class="font-bold">RENDER</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
        <!-- Settings -->


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
    <ConfigModal v-model:showModal="showConfigModal" @submit="handleConfig" />
</template>

<script setup>
// --- Imports ---
import { onMounted, ref, computed, watch, nextTick, reactive, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';
import "pdfjs-dist/web/pdf_viewer.css";

// Icons
import IconSearchBulb from '@/assets/icons/search-bulb.svg';
import IconTextAverage from '@/assets/icons/text-average.svg';
import IconTextMinus from '@/assets/icons/text-minus.svg';
import IconTextPlus from '@/assets/icons/text-plus.svg';
import IconGallery from '@/assets/icons/gallery.svg';
import IconPlus from '@/assets/icons/image-plus-svgrepo-com.svg';
import QrIcon from '@/assets/icons/qr-code-svgrepo-com.svg';
import TextField from '@/assets/icons/text-field-svgrepo-com.svg';
import Text from '@/assets/icons/text-circle-svgrepo-com.svg';
import LeftMiniArrow from '@/assets/icons/arrow-next-small-svgrepo-com.svg';
import LeftArrow from '@/assets/icons/left-arrow-svgrepo-com.svg';
import Home from '@/assets/icons/home-smile-svgrepo-com.svg';
import RotateIcon from '@/assets/icons/bended-arrow-svgrepo-com.svg';
import { FileEditIcon, HomeIcon } from 'lucide-vue-next';

// Internal
import { mainApi } from '@/api';
import { showNotification } from '../composables/useNotification';
import { usePdfEditRequestStore } from '../stores/requestEditorStore';
import { useLoading } from '../composables/useLoading';
import ConfigModal from '../components/EditorComponents/ConfigModal.vue';
import ControlPanel from '../components/EditorComponents/ControlPanel.vue';
import DropDown from '../components/EditorComponents/DropDown.vue';
import { useAuthStore } from '../stores/authStore';

// --- Configuration ---
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';
const route = useRoute();
const { show, hide } = useLoading();
const DtoEditorStore = usePdfEditRequestStore();
const authStore = useAuthStore();

// --- State: PDF & Workspace ---
let pdfDoc;
const role = authStore.getPayload().role
const pdfId = ref(route.query.fileId);
const pdfFile = ref();
const pageCount = ref();
const numPages = ref();
const activePage = ref(1);
const pages = ref([]);
const workspaceDiv = ref(null);
const workSpaceViewport = ref({ width: 1080, height: 720 });
const canvasHeight = ref(0);
const pageTemplate = ref([]);

// --- State: Editor Objects ---
const objects = ref([
    // { id: 1001, type: 'text', x: 100, y: 100, width: 200, height: 50, rotation: 0, pageNumber: 1, props: { font: 'Arial', content: 'testtt', fontSize: 16, isBold: false, isItalic: false, isUnderline: false, color: { r: 0, g: 0, b: 0 } } }
]);
const selectedObjectId = ref(null);
const editingObjectId = ref(null);
const selectedObject = computed(() => objects.value.find(obj => obj.id === selectedObjectId.value));
const newObject = ref([{ id: 0, type: 'field', x: 0, y: 0 }]); // Ref placeholder

// --- State: Interaction (Drag, Resize, Rotate) ---
const isDragging = ref(false);
const dragObjectId = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
const mouseDrag = ref({ x: 0, y: 0 });

const isResizing = ref(false);
const resizeObjectId = ref(null);
const initialSize = ref({ width: 0, height: 0 });
const initialMouse = ref({ x: 0, y: 0 });

const isRotating = ref(false);
const rotateObjectId = ref(null);
const initialAngle = ref(0);

const placement = ref({
    mode: 'asset_select' | 'text' | 'image' | 'field' | 'qr' | null,
    selectedAssetId: null,
    dotPosition: { x: 0, y: 0 },
});
const dotPosition = computed(() => placement.value.dotPosition);

// --- State: UI & Controls ---
const showControlPanel = ref(false);
const propertyControlPanel = ref();
const onHover = ref(true);
const showSettings = ref(true);
const showConfigModal = ref(false);
const isLoadingRender = ref(false);
const fab = ref({ enabled: false });
const field = ref({ enabled: false });
const mainExpandBar = ref({ enabled: false });

// --- State: Assets & Data ---
const assetLibrary = ref([]);
const fileImg = ref(null);
const uploadProgress = ref(0);
const qrSampleUrl = ref();

// --- State: Forms & Tables ---
const pdfFileName = ref();
const renderOption = ref();
const formConfiguration = reactive({ pdfFileName: '', renderOption: '', entityTarget: '' });
const tableTypeSelected = ref(role === 'BUKUWISUDA' ? 'mahasiswa' : '');
const tableFieldSelected = ref();
const tableFields = ref();
const isTableTypeSet = role == 'BUKUWISUDA' || computed(() => objects.value.some(e => e.type == 'field' || e.type == 'qr'));
const fieldSampleType = ref();
const fieldSampleTypes = [
    { id: "max", tooltip: "Panjang maksimum", icon: IconTextPlus, disabled: false },
    { id: "min", tooltip: "Panjang minimum", icon: IconTextMinus, disabled: false },
    { id: "avg", tooltip: "Panjang rata-rata", icon: IconTextAverage, disabled: false }
];


const handleConfig = async (e) => {
    // await render()
    if (!(e.projectName && e.saveToDB || e.asZip)) {
        return showNotification('error', 'lengkapi semua isian configuration')
    }
    DtoEditorStore.setConfig(e.projectName, e.asZip, e.saveToDB)
    await render()
}


// --- Lifecycle & Watchers ---
onMounted(async () => {
    show("Mengunduh file...");
    window.addEventListener("keydown", handleKeyDown);
    try {
        await loadPDF();
        pages.value.forEach(page => {
            const container = document.querySelector(`[aria-label="Page ${page.pageNumber}"] div`);
            if (container) {
                container.appendChild(page.canvas);
                Object.assign(page.canvas.style, { width: "100%", height: "100%", objectFit: "contain" });
            }
        });
        await setWorkSpace(activePage.value);
        if (workspaceDiv.value) canvasHeight.value = workspaceDiv.value.getBoundingClientRect();
        loadDraft(pdfId.value)
        console.log('assetlibrary=', assetLibrary.value)
    } catch (e) {
        showNotification('warning', e.message);
    } finally {
        hide();
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
});

watch(activePage, async () => await setWorkSpace(activePage.value));
// watch(tableFieldSelected, () => console.log(tableFieldSelected.value));
// watch(objects.value, () => console.log(objects.value));
watch(tableTypeSelected, async (newVal) => {
    const res = await mainApi.get(`peserta/fields?table=${newVal}`);
    tableFields.value = res.data;
    DtoEditorStore.configuration.tableReference = newVal
}, { immediate: true });
//Testing



// --- Core PDF Logic ---
const loadPDF = async () => {
    const res = await mainApi.get(`/files/${pdfId.value}`, { responseType: 'arraybuffer' });
    pdfDoc = await pdfjsLib.getDocument({ data: res.data }).promise;
    DtoEditorStore.setPdfId(Number(pdfId.value));
    numPages.value = pdfDoc.numPages;

    for (let i = 1; i <= numPages.value; i++) {
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
        pages.value.push({ id: i, pageNumber: i, canvas });
    }
    activePage.value = 1;
};

const setWorkSpace = async (pageNum) => {
    const page = await pdfDoc.getPage(pageNum);
    const pageViewport = page.getViewport({ scale: 1 });
    const canvas = document.getElementById('work-space');
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
};


// --- Interaction Handlers (Drag, Rotate, Resize) ---
const handleObjectMouseDown = (event, object) => {
    if (editingObjectId.value === object.id) return;
    event.preventDefault();
    selectObject(object);
    startDrag(event, object.id);
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
    const componentHeight = selectedObject.value.height;
    const componentWidth = selectedObject.value.width;
    const rect = workspaceDiv.value.getBoundingClientRect();
    const rawX = e.clientX - rect.left - dragOffset.value.x;
    const rawY = e.clientY - rect.top - dragOffset.value.y;
    const clampedX = Math.max(0, Math.min(rawX, rect.width - componentWidth));
    const clampedY = Math.max(0, Math.min(rawY, rect.height - componentHeight));
    mouseDrag.value.x = rawY;
    updateObjectTransform(dragObjectId.value, { x: clampedX, y: clampedY });
};

const stopDrag = () => {
    isDragging.value = false;
    dragObjectId.value = null;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
};

const initialAspectRatio = ref(1);
const initialFontSize = ref(16);
const startResize = (e, objectId) => {
    e.preventDefault();
    isResizing.value = true;
    resizeObjectId.value = objectId;
    
    const obj = objects.value.find(o => o.id === objectId);
    
    if (obj && workspaceDiv.value) {
        const rect = workspaceDiv.value.getBoundingClientRect();
        
        // Simpan ukuran & posisi mouse awal
        initialSize.value = { width: obj.width, height: obj.height };
        initialMouse.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        
        // 1. Simpan Aspect Ratio (Penting untuk Gambar & Teks proporsional)
        initialAspectRatio.value = obj.width / obj.height;

        // 2. Simpan Font Size awal (Khusus Text)
        if (obj.type === 'text' || obj.type === 'field') {
            initialFontSize.value = obj.props.fontSize || 16;
        }
    }
    
    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', stopResize);
};
// Tambahkan ref ini di bagian setup variable Anda

const onResize = (e) => {
    if (!isResizing.value || !workspaceDiv.value) return;

    const obj = objects.value.find(o => o.id === resizeObjectId.value);
    if (!obj) return;

    const rect = workspaceDiv.value.getBoundingClientRect();
    const deltaX = e.clientX - rect.left - initialMouse.value.x;
    const deltaY = e.clientY - rect.top - initialMouse.value.y;

    // --- KALKULASI UKURAN BARU ---
    // Kita gunakan width sebagai patokan utama ("driver") pergerakan mouse
    let newWidth = initialSize.value.width + deltaX;
    
    // --- ATURAN 1: MINIMUM SIZE (1% Canvas) ---
    const minWidth = rect.width * 0.01; 
    newWidth = Math.max(minWidth, newWidth);

    // --- ATURAN 2: ASPECT RATIO (Untuk Image & Text) ---
    // Hitung height berdasarkan width baru agar rasio terjaga
    let newHeight = newWidth / initialAspectRatio.value;

    // --- ATURAN 3: BOUNDARY CHECK (Tidak boleh tembus Border Canvas) ---
    const maxWidthAllowed = rect.width - obj.x;  // Sisa ruang di kanan
    const maxHeightAllowed = rect.height - obj.y; // Sisa ruang di bawah

    // Cek jika Width melebihi batas kanan
    if (newWidth > maxWidthAllowed) {
        newWidth = maxWidthAllowed;
        newHeight = newWidth / initialAspectRatio.value; // Recalculate height
    }

    // Cek jika Height melebihi batas bawah (Double check)
    if (newHeight > maxHeightAllowed) {
        newHeight = maxHeightAllowed;
        newWidth = newHeight * initialAspectRatio.value; // Recalculate width
    }

    // --- ATURAN 4: UPDATE FONT SIZE (Khusus Text) ---
    if (obj.type === 'text' || obj.type === 'field') {
        // Hitung skala perubahan berdasarkan tinggi (lebih akurat untuk font)
        const scaleFactor = newHeight / initialSize.value.height;
        const newFs = Math.floor(initialFontSize.value * scaleFactor);
        
        // Batasi font size minimal (misal 8px)
        obj.props.fontSize = Math.max(8, newFs);
    }

    // --- APPLY TRANSFORM ---
    updateObjectTransform(resizeObjectId.value, { 
        width: newWidth, 
        height: newHeight 
    });
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

const updateDotPosition = (e) => {
    if (!workspaceDiv.value) return;
    const rect = workspaceDiv.value.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    placement.value.dotPosition.x = Math.max(0, Math.min(rawX, rect.width));
    placement.value.dotPosition.y = Math.max(0, Math.min(rawY, rect.height));
};


// --- Editor Logic (Placement, Selection, Text) ---
const handleKeyDown = (e) => {
    if (!selectedObjectId) return;
    if (editingObjectId.value != null) return;
    if (e.key === "Delete" || e.key === "Backspace") {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        deleteObject(selectedObjectId.value);
    }
};

const startPlacement = async (mode, assetId = null) => {
    if (!fab.value.enabled) return;
    placement.value.mode = mode;
    placement.value.selectedAssetId = (mode == 'image') ? assetId : null;
    if (mode == 'image' && !assetId) placement.value.selectedAssetId = placement.value.selectedAssetId;
    if (placement.value.mode !== 'asset_select') console.log(`Entering placement mode: ${placement.value.mode}`);
};


const getImageDimensions = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: 100, height: 100 });
        img.src = src;
    });
};

const getTextDimensions = (text, fontSize, fontFamily) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px ${fontFamily}`;
    const metrics = context.measureText(text);
    return {
        width: Math.ceil(metrics.width) + 10,
        height: Math.ceil(fontSize * 1.2)
    };
};

const confirmPlacement = async () => {
    if (!workspaceDiv.value) return;
    const canvasRect = workspaceDiv.value.getBoundingClientRect();
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;

    let finalWidth = 100;
    let finalHeight = 100;
    let props = {};

    if (placement.value.mode === 'text') {
        const defaultText = 'TextField';
        const fontSize = 16;
        const font = 'Arial';

        props = { font, content: defaultText, fontSize, isBold: false, isItalic: false, isUnderline: false, color: { r: 0, g: 0, b: 0 } };

        const dims = getTextDimensions(defaultText, fontSize, font);
        finalWidth = dims.width;
        finalHeight = dims.height;

    } else if (placement.value.mode === 'image') {
        props = { assetId: placement.value.selectedAssetId, opacity: 100 };

        const url = getAssetUrl(placement.value.selectedAssetId);
        const dims = await getImageDimensions(url);
        finalWidth = dims.width;
        finalHeight = dims.height;

    } else if (placement.value.mode === 'field') {
        const content = await handleGetFieldText();
        props = { font: 'Arial', content: content, fieldName: tableFieldSelected.value, fontSize: 16, isBold: false, isItalic: false, isUnderline: false, color: { r: 0, g: 0, b: 0 } };

        const dims = getTextDimensions(content, 16, 'Arial');
        finalWidth = dims.width;
        finalHeight = dims.height;

    } else if (placement.value.mode === 'qr') {
        await loadQrSample();

        const dims = await getImageDimensions(qrSampleUrl.url);
        finalWidth = dims.width;
        finalHeight = dims.height;
    }

    if (finalWidth > canvasWidth || finalHeight > canvasHeight) {
        const aspectRatio = finalWidth / finalHeight;

        const targetWidth = canvasWidth * 0.10;
        const targetHeight = targetWidth / aspectRatio;

        finalWidth = targetWidth;
        finalHeight = targetHeight;

        showNotification('warning',"Object too big, scaled down to 10% of canvas");
    }

    const newObj = {
        id: Date.now(),
        id_page: activePage.value,
        type: placement.value.mode,
        x: placement.value.dotPosition.x,
        y: placement.value.dotPosition.y,
        width: finalWidth,  
        height: finalHeight, 
        rotation: 0,
        pageNumber: activePage.value,
        opacity: 1,
        props: props
    };

    objects.value.push(newObj);
    selectObject(newObj);
    cancelPlacement();
    showNotification('success',`Object placed: ${newObj.type} size: ${finalWidth}x${finalHeight}`);
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
    if (object.type == 'text' || object.type == 'field') showControlPanel.value = true;
    selectedObjectId.value = object.id;
    console.log(`Object ${object.id} selected.`);
};

const deleteObject = (objectId) => {
    objects.value = objects.value.filter(obj => obj.id !== objectId);
    selectedObjectId.value = null;
    showControlPanel.value = false;
    console.log(objectId);
};

const updateObjectTransform = (objectId, newTransform) => {
    const obj = objects.value.find(o => o.id === objectId);
    if (obj) Object.assign(obj, newTransform);
};

const handleInputText = (object) => {
    if (object.type !== 'text') return;
    editingObjectId.value = object.id;
    nextTick(() => {
        const el = document.getElementById(`input-${object.id}`);
        el?.focus();
    });
};

const finishEdit = () => editingObjectId.value = null;
const handleEnter = (e, object) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        finishEdit(object);
    }
};


// --- Template & Pages ---
const handleSelectAll = () => {
    const total = Number(numPages.value) || 0;
    if (total <= 0) return;
    const full = Array.from({ length: total }, (_, i) => i + 1);
    const current = pageTemplate.value || [];
    const isAllSelected = current.length === total && full.every((n) => new Set(current).has(n));

    if (isAllSelected) {
        if (deleteTemplate()) pageTemplate.value.splice(0, pageTemplate.value.length);
    } else {
        pageTemplate.value.splice(0, pageTemplate.value.length, ...full);
    }
};

const selectPage = (pageNumber) => {
    cancelPlacement()
    fab.value.enabled = pageTemplate.value.includes(pageNumber, 0);
    activePage.value = pageNumber;
    selectedObjectId.value = null;

    console.log(`Page ${pageNumber} selected.`);
};

const setTemplate = () => {
    if (!pageTemplate.value.includes(activePage.value)) {
        pageTemplate.value.push(activePage.value);
        fab.value.enabled = true;
        return;
    }
    deleteTemplate();
};

const deleteTemplate = () => {
    const confirmation = confirm('yakin hapus template?');
    if (confirmation) {
        const index = pageTemplate.value.findIndex((e) => e === activePage.value);
        pageTemplate.value.splice(index, 1);
        fab.value.enabled = false;
    }
    return confirmation;
};


// --- Assets (Images/QR) & API Helpers ---
const openAssetSelector = async () => {
    if (fab.value.enabled) {
        placement.value.mode = 'asset_select';
        placement.value.selectedAssetId = null;
        console.log('Asset Selector Opened.');
        await loadLibrary();
    }
};

const loadLibrary = async () => {
    const res = await mainApi.get('files?type=image');
    const ids = res.data.map(data => data.id_file);
    ids.forEach(async id => {
        if (!assetLibrary.value.some(item => item.id === id)) {
            const dataImg = await mainApi.get(`files/${id}`, { responseType: 'arraybuffer' });
            const blob = new Blob([dataImg.data], { type: "image/png" });
            assetLibrary.value.push({ id, url: URL.createObjectURL(blob), name: `asset${id}` });
        }
    });
};

const uploadImg = async () => {
    if (!fileImg.value) return;
    let interval = null;
    try {
        const formData = new FormData();
        formData.append('file', fileImg.value);
        uploadProgress.value = 1;
        interval = setInterval(() => { if (uploadProgress.value < 90) uploadProgress.value++; }, 80);

        await mainApi.post(`files`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploadProgress.value = 100;
        setTimeout(() => uploadProgress.value = 0, 500);
        await loadLibrary();
    } catch (e) {
        showNotification('error', 'Gagal upload gambar');
        uploadProgress.value = 0;
    } finally {
        if (interval) clearInterval(interval);
        fileImg.value = null;
    }
};

const deleteImg = async () => {
    const id = placement.value.selectedAssetId;
    if (confirm(`Yakin menghapus asset? ${id}`)) {
        await mainApi.delete(`files/${id}`);
        assetLibrary.value = assetLibrary.value.filter(a => a.id !== id);
        placement.value.selectedAssetId = null;
    }
};

const onFileChange = (event) => fileImg.value = event.target.files[0];
const getAssetUrl = (assetId) => assetLibrary.value.find(a => a.id === assetId)?.url || '';
const loadQrSample = async () => {
    const dataImg = await mainApi.post(`qr/generate/sample`, {}, { responseType: 'arraybuffer' });
    console.log(dataImg.data);
    const blob = new Blob([dataImg.data], { type: "image/png" });
    qrSampleUrl.value = { url: URL.createObjectURL(blob), name: `Qr Sample` };
};

const handleGetFieldText = async () => {
    try {
        const res = await mainApi.post(`peserta/field/sample/${fieldSampleType.value}?table=${tableTypeSelected.value}`, {
            select: { [tableFieldSelected.value]: true }
        });
        return String(res.data);
    } catch (error) {
        showNotification('error', `field tidak ditemukan: ${error.message}`);
    }
};

const handlePropertyControlPanel = async (event) => propertyControlPanel.value = event;

const getTextStyle = (props) => {
    if (!props) return {};
    console.log("color = ", props.color)
    return {
        fontFamily: props.font,
        fontSize: `${props.fontSize}px`,
        fontWeight: props.isBold ? 'bold' : 'normal',
        fontStyle: props.isItalic ? 'italic' : 'normal',
        textDecoration: props.isUnderline ? 'underline' : 'none',
        color: `rgb(${props.color.r}, ${props.color.g}, ${props.color.b})`,
        backgroundColor: 'transparent'
    };
};




// --- Render Logic ---
const saveDraft = () => {
    const draft = {
        'pdfId': pdfId.value,
        'editablePages': pageTemplate.value,
        'objects': objects.value
    }
    let allDrafts = JSON.parse(localStorage.getItem("drafts")) || {};
    allDrafts[pdfId.value] = draft;
    localStorage.setItem("drafts", JSON.stringify(allDrafts));
    console.log('draft saved', (localStorage.getItem("drafts")))
    showNotification('success', 'Draft disimpan')
}

const loadDraft = async (pdf_id) => {
    const drafts = JSON.parse(localStorage.getItem("drafts")) || {};
    const draft = drafts[pdf_id];
    // localStorage.removeItem('drafts')
    console.log('drafts loaded :', drafts);
    console.log('draft loaded :', draft);

    if (!draft) return;

    const obj = JSON.parse(JSON.stringify(draft.objects));
    if (Array.from(obj).find(e => e.type == 'qr')) {
        await loadQrSample();
    }
    if (Array.from(obj).find(e => e.type == 'image')) {
        await loadLibrary();
    }
    objects.value = obj
    pageTemplate.value = JSON.parse(JSON.stringify(draft.editablePages));

    console.log('objects', objects.value);
    console.log('template', pageTemplate.value);
};

const prepareEditorDto = () => {
    DtoEditorStore.init();
    const editablePages = pageTemplate.value.map((pageNum) => {
        const thisObject = objects.value.filter((e) => e.id_page == Number(pageNum));

        const restructuredObjects = thisObject.map((obj) => {
            const props = obj.props;

            let colorObject = {
                r: Number,
                g: Number,
                b: Number
            };

            colorObject.r = (props.color?.r) ?? 0;
            colorObject.g = (props.color?.g) ?? 0;
            colorObject.b = (props.color?.b) ?? 0;


            let textStyleObject = {
                fontSize: props?.fontSize ?? 13,
                fontFamily: props?.font ?? 'Arial',
                bold: props?.isBold,
                italic: props?.isItalic,
                color: colorObject
            }

            return {
                id: String(obj.id),
                type: obj.type,

                content: obj.props?.content ?? '',
                fieldName: obj.props?.fieldName ?? '',
                fileId: Number(obj.props?.assetId) ?? 0,

                position: {
                    x: Number(obj.x),
                    y: Number(obj.y)
                },

                size: {
                    width: obj.width,
                    height: obj.height
                },

                textstyle: textStyleObject,

                opacity: obj.opacity,
                rotation: obj.rotation,
            }
        });

        return {
            pageNumber: Number(pageNum),
            elements: restructuredObjects
        }
    });
    DtoEditorStore.setEditablePages(editablePages);
}

const render = async () => {
    showConfigModal.value = true;
    isLoadingRender.value = true;
    prepareEditorDto();
    try {
        const json = DtoEditorStore.getState();
        console.log(JSON.stringify(json));
        await mainApi.post('editorpdf/render', json);
        showNotification('success', `Render Berhasil, cek pada file manager`);
    } catch (error) {
        showNotification('error', `${error.response.data.message}`);
        console.log(error);
    } finally {
        isLoadingRender.value = false;
        showConfigModal.value = false;
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
