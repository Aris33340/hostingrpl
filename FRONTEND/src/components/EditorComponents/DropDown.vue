<template>
    <el-dropdown class="inline-block">
        <button
            class="inline-flex w-full justify-center gap-x-1.5 bg-white/10 px-3 py-2 text-sm font-semibold text-gray-500 inset-ring-1 inset-ring-white/5 hover:bg-gray-300 active:bg-gray-400 rounded-l-3xl">
            {{ selected || "Select Fonts" }}
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="-mr-1 size-5 text-gray-400">
                <path
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    fill-rule="evenodd" clip-rule="evenodd" />
            </svg>
        </button>

        <el-menu anchor="bottom end" popover
            class="h-44 w-56 origin-top-right divide-y divide-white/10 rounded-md bg-white outline-1 transition">

            <div class="py-1">
                <template v-for="(item, idx) in items" :key="idx">
                    <button
                        class="block w-full hover:bg-gray-300 active:bg-gray-400 text-left px-4 py-2 text-sm text-gray-800"
                        @click="emits('select', item)">
                        {{ item }}
                    </button>
                </template>
            </div>
        </el-menu>
    </el-dropdown>
</template>


<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    selected: String,
})
const emits = defineEmits(['select'])
</script>