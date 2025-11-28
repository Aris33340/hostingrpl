<template>
    <div class="bg-white mb-5 w-[90%] h-14 rounded-3xl mt-4 shadow-lg flex items-center px-4 text-gray-600 z-10 absolute">
        <div class="flex flex-row items-center gap-4 w-full">

            <!-- Dropdown -->
            <span class="h-full flex items-center">
                <DropDown :selected="props.prop.font" :items="menuItems" @select="onEmits" />
            </span>

            <div class="flex border h-full border-gray-200 rounded-lg">
                <button @click.stop.prevent="props.prop.fontSize--"
                    class="hover:bg-gray-200 w-7 text-center cursor-pointer rounded-l-lg"> - </button>

                <input @change.prevent="updateFontSize" :value="props.prop.fontSize" type="number" min="1" max="210"
                    @keydown.enter="unfocus" class="bg-transparent text-center w-20">

                <button class="hover:bg-gray-200 w-7 text-center cursor-pointer rounded-r-lg"
                    @click.stop.prevent="props.prop.fontSize++"> + </button>
            </div>

            <!-- Button group -->
            <div class="flex flex-row items-center gap-2">
                <button @click.stop.prevent="handleBold"
                    :class="['h-8 px-3 font-bold font-mono active:bg-gray-400', props.prop.isBold ? 'bg-gray-300' : '']">B</button>
                <button @click.stop.prevent="handleItalic"
                    :class="['h-8 px-3 italic font-mono active:bg-gray-400', props.prop.isItalic ? 'bg-gray-300' : '']">I</button>
                <button @click.stop.prevent="handleUnderline"
                    :class="['h-8 px-3 underline font-mono active:bg-gray-400', props.prop.isUnderline ? 'bg-gray-300' : '']">U</button>
            </div>

            <!-- COLOR PICKER TOOL -->
            <!-- Tambahkan @click="triggerColorPicker" -->
            <span @click="triggerColorPicker"
                class="px-4 py-1 flex flex-col hover:bg-gray-300 active:bg-gray-400 cursor-pointer relative group">

                <!-- Indikator warna teks saat ini (Optional: ubah warna A sesuai pilihan) -->
                <div class="font-bold"
                    :style="{ color: `rgb(${props.prop.color.r}, ${props.prop.color.g}, ${props.prop.color.b})` }">
                    A
                </div>

                <!-- Garis pelangi (Icon) -->
                <div class="w-full h-1 mt-0.5"
                    style="background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, purple);">
                </div>

                <!-- INPUT COLOR TERSEMBUNYI -->
                <!-- Input ini tidak terlihat, tapi akan diklik secara programatis -->
                <input ref="colorInputRef" type="color" :value="currentHexColor" @input="handleColorChange"
                    class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer -z-10" />
            </span>

            <!-- Spacer -->
            <div class="flex-1"></div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DropDown from './DropDown.vue'

// Refs
const selected = ref("")
const colorInputRef = ref(null) // Referensi ke elemen input color

const props = defineProps({
    prop: {
        font: String,
        content: String,
        fontSize: Number,
        isBold: Boolean,
        isItalic: Boolean,
        isUnderline: Boolean,
        color: { r: Number, g: Number, b: Number } // Format RGB
    },
})

const emits = defineEmits(['textType', 'isBold', 'isItalic', 'isUnderline', 'property'])

// --- LOGIC WARNA ---

// 1. Helper: Mengubah RGB Object ke Hex String (untuk value input html)
const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// 2. Helper: Mengubah Hex String ke RGB Object (untuk update props)
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// 3. Computed properti untuk binding ke input color
const currentHexColor = computed(() => {
    if (props.prop.color) {
        return rgbToHex(props.prop.color.r, props.prop.color.g, props.prop.color.b);
    }
    return '#000000';
});

// 4. Trigger click pada input hidden saat wrapper diklik
const triggerColorPicker = () => {
    colorInputRef.value.click();
}

// 5. Handle perubahan warna dari picker
const handleColorChange = (event) => {
    const hex = event.target.value;
    const rgbObj = hexToRgb(hex);

    // Update props secara reaktif (karena object props di vue reaktif)
    props.prop.color = rgbObj;

    // Emit event jika parent butuh notifikasi
    emits('property', {
        key: 'color',
        value: rgbObj
    });
}
// -------------------


const handleBold = () => {
    props.prop.isBold = !props.prop.isBold
    emits('property', { key: 'isBold', value: props.prop.isBold })
}

const handleItalic = () => {
    props.prop.isItalic = !props.prop.isItalic
    emits('property', { key: 'isItalic', value: props.prop.isItalic })
}

const handleUnderline = () => {
    props.prop.isUnderline = !props.prop.isUnderline
    emits('property', { key: 'isUnderline', value: props.prop.isUnderline })
}

const updateFontSize = (event) => {
    const val = Number(event.target.value)
    let newValue = val
    if (newValue < 1) newValue = 1
    if (newValue > 210) newValue = 210
    props.prop.fontSize = newValue
    emits('property', { key: 'fontSize', value: newValue })
}

const unfocus = (e) => {
    e.target.blur();
}

const menuItems = ["Arial", "Verdana", "Times New Roman"]

const onEmits = async (event) => {
    props.prop.font = event
    emits('property', { key: 'font', value: event })
}

</script>

<style>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
}
</style>