<template>
    <div class="bg-white mb-5 w-[90%] h-14 rounded-3xl mt-4 shadow-lg flex items-center px-4 text-gray-600 z-10">

        <div class="flex flex-row items-center gap-4 w-full">

            <!-- Dropdown -->
            <span class="h-full flex items-center">
                <DropDown :selected="selected" :items="menuItems" @select="onEmits" />
            </span>

            <div class="flex border h-full border-gray-200 rounded-lg">
                <button @click.stop.prevent="fontSize--"
                    class="hover:bg-gray-200 w-7 text-center cursor-pointer rounded-l-lg">
                    -
                </button>
                <input v-model.number="fontSize" type="number" min="1" max="210" @keydown.enter="unfocus"
                    class="bg-transparent text-center w-20">
                <button class="hover:bg-gray-200 w-7 text-center cursor-pointer rounded-r-lg"
                    @click.stop.prevent="fontSize++">
                    +
                </button>
            </div>
            <!-- Button group -->
            <div class="flex flex-row items-center gap-2">
                <button @click.stop.prevent="handleBold"
                    :class="['h-8 px-3 font-bold font-mono active:bg-gray-400', isBold ? 'bg-gray-300' : '']">B</button>
                <button @click.stop.prevent="handleItalic"
                    :class="['h-8 px-3 italic font-mono active:bg-gray-400', isItalic ? 'bg-gray-300' : '']">I</button>
                <button @click.stop.prevent="handleUnderline"
                    :class="['h-8 px-3 underline font-mono active:bg-gray-400', isUnderline ? 'bg-gray-300' : '']">U</button>
            </div>

            <!-- Other tool -->
            <span class="px-4 py-1 flex flex-col  hover:bg-gray-300 active:bg-gray-400 cursor-pointer">
                <div class="text-gray-400">A</div>
                <div class=" w-3 h-1" style="background: linear-gradient(
                        to right,
                        red,
                        orange,
                        yellow,
                        green,
                        cyan,
                        blue,
                        purple
                        );">
                </div>
            </span>

            <!-- Spacer agar render di kanan -->
            <div class=" flex-1"></div>

            <!-- Render button -->
            <button @click="render"
                class="h-10 px-5 bg-blue-800 text-white hover:bg-blue-500 active:bg-blue-900 rounded-full cursor-pointer">
                RENDER
            </button>

        </div>
    </div>
</template>


<script setup>
import { computed, ref, watch } from 'vue'
import DropDown from './DropDown.vue'
const fontSize = ref(0);
const selected = ref("")
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);



if (fontSize.value < 0) {
    fontSize.value = 0
} else if (fontSize.value > 210) fontSize.value = 210

const handleBold = () => {
    isBold.value = !isBold.value
    emits('property', {
        key: 'isBold',
        value: isBold.value
    })
}
const handleItalic = () => {
    isItalic.value = !isItalic.value
    emits('property', {
        key: 'isItalic',
        value: isItalic.value
    })

}
const handleUnderline = () => {
    isUnderline.value = !isUnderline.value
    emits('property', {
        key: 'isUnderline',
        value: isUnderline.value
    })
}


const unfocus = (e) => {
    e.target.blur();
}

watch(fontSize, (value) => {
    if (value < 1) fontSize.value = 1
    if (value > 210) fontSize.value = 210
    emits('property', { key: 'fontSize', value: fontSize.value })
})

const menuItems = [
    "Edit",
    "Duplicate",
    "Archive",
    "Move",
    "Share",
    "Add to favorites",
    "Delete"
]


const onEmits = async (event) => {
    selected.value = event
    emits('property', {
        key: 'font',
        value: event
    })
}

const emits = defineEmits(['textType', 'isBold', 'isItalic', 'property'])
</script>
<style>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    /* -webkit-appearance: none; */
    /* -moz-appearance: none; */
    appearance: none;
    margin: 0;
}
</style>