<template>
    <div class="app-container" @mouseup="endDrag" @mousemove="onMouseMove">

        <div class="sidebar" ref="sidebarRef">
            <h3>Pages</h3>
            <div class="page-list">

                <div v-for="(page, index) in pages" :key="page.id" class="page-item" :class="{
                    'active': selectedPage?.id === page.id,
                    'is-template': isTemplate(page.id),
                    'ghost-placeholder': dragState.isDragging && index === dragState.placeholderIndex
                }" @mousedown="(e) => handleMouseDown(e, index)" @click="selectPage(page)">
                    <div class="page-content">
                        Page {{ page.pageNumber }}
                        <span v-if="isTemplate(page.id)" class="badge">TEMPLATE</span>
                    </div>
                </div>

            </div>
        </div>

        <div class="workspace">
            <div v-if="selectedPage" class="editor-area">
                <div class="top-bar">
                    <h2>Editing Page {{ selectedPage.pageNumber }}</h2>
                    <button @click="toggleTemplate" :class="isTemplate(selectedPage.id) ? 'btn-unset' : 'btn-set'">
                        {{ isTemplate(selectedPage.id) ? 'Unset Template' : 'Set as Template' }}
                    </button>
                </div>

                <div class="canvas-mock">
                    <p>Ini adalah tampilan visual workspace untuk Page ID: {{ selectedPage.id }}</p>
                    <p>Status: {{ isTemplate(selectedPage.id) ? 'Ini adalah Template' : 'Halaman Biasa' }}</p>
                </div>

                <div class="debug-info">
                    <p><strong>Current Order:</strong> {{pages.map(p => p.pageNumber)}}</p>
                    <p><strong>Templates IDs:</strong> {{ templateIds }}</p>
                </div>
            </div>
            <div v-else class="empty-state">
                Pilih halaman di sidebar untuk mulai edit
            </div>
        </div>

        <div v-if="dragState.isDragging" class="drag-ghost"
            :style="{ top: dragState.y + 'px', left: dragState.x + 'px' }">
            Page {{ pages[dragState.originalIndex].pageNumber }}
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue';

// --- 1. DATA & STATE ---

// Mock Data Halaman PDF
const generatePages = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({
    id: `uuid-${n}`,
    pageNumber: n,
    content: `Content of page ${n}`
}));

const pages = ref(generatePages());
const selectedPage = ref(null);
const templateIds = ref([]); // Array untuk menyimpan ID halaman yg jadi template

// State untuk Drag Logic
const sidebarRef = ref(null);
const clickTimer = ref(null);
const lastClickTime = ref(0);
const scrollInterval = ref(null);

const dragState = reactive({
    isDragging: false,
    originalIndex: -1,     // Index asli item yg didrag
    placeholderIndex: -1,  // Di mana item akan jatuh
    x: 0,
    y: 0,
    offsetY: 0             // Supaya mouse tetap di titik relatif saat grab
});

// --- 2. LOGIKA UMUM ---

const selectPage = (page) => {
    // Cegah select jika sedang dragging
    if (dragState.isDragging) return;
    selectedPage.value = page;
};

const isTemplate = (id) => templateIds.value.includes(id);

const toggleTemplate = () => {
    if (!selectedPage.value) return;
    const id = selectedPage.value.id;

    if (templateIds.value.includes(id)) {
        // Remove (Unset)
        templateIds.value = templateIds.value.filter(tId => tId !== id);
    } else {
        // Add (Set)
        templateIds.value.push(id);
    }
};

// --- 3. LOGIKA DRAG & DROP (DBLCLICK + HOLD) ---

const handleMouseDown = (e, index) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime.value;

    // Deteksi "Double Click" manual (< 300ms antar klik)
    if (timeDiff < 300) {
        startDrag(e, index);
        // User melakukan klik kedua dengan cepat -> Init Drag
    } else {
        // Klik pertama (atau klik lambat)
        lastClickTime.value = now;
    }
};

const startDrag = (e, index) => {
    e.preventDefault(); // Mencegah seleksi teks browser

    dragState.isDragging = true;
    dragState.originalIndex = index;
    dragState.placeholderIndex = index;

    // Posisi awal Ghost Element
    dragState.x = e.clientX + 10; // Sedikit geser biar ga ketutup cursor
    dragState.y = e.clientY;
    // window.addEventListener("mousemove", onMouseMove)
    // window.addEventListener("mouseup", endDrag)
};

const onMouseMove = (e) => {
    if (!dragState.isDragging) return;

    // 1. Update posisi visual Ghost
    dragState.x = e.clientX + 10;
    dragState.y = e.clientY;

    // 2. Auto Scroll Logic
    handleAutoScroll(e.clientY);

    // 3. Hitung Placeholder Index (Logika Reordering)
    calculatePlaceholderIndex(e.clientY);
};

const handleAutoScroll = (mouseY) => {
    if (!sidebarRef.value) return;
    const rect = sidebarRef.value.getBoundingClientRect();
    const threshold = 50; // Jarak dari tepi untuk mulai scroll
    const speed = 10;

    // Hapus interval lama biar ga numpuk
    clearInterval(scrollInterval.value);
    scrollInterval.value = null;

    if (mouseY < rect.top + threshold) {
        // Scroll Up
        scrollInterval.value = setInterval(() => {
            sidebarRef.value.scrollTop -= speed;
            calculatePlaceholderIndex(dragState.y); // Recalculate saat scroll berjalan
        }, 16);
    } else if (mouseY > rect.bottom - threshold) {
        // Scroll Down
        scrollInterval.value = setInterval(() => {
            sidebarRef.value.scrollTop += speed;
            calculatePlaceholderIndex(dragState.y);
        }, 16);
    }
};

const calculatePlaceholderIndex = (mouseY) => {
    if (!sidebarRef.value) return;

    // Ambil semua elemen item di sidebar
    const items = Array.from(sidebarRef.value.querySelectorAll('.page-item'));

    // Cari item mana yang sedang di-hover
    let newIndex = items.length; // Default paling bawah

    for (let i = 0; i < items.length; i++) {
        const rect = items[i].getBoundingClientRect();
        const midPoint = rect.top + (rect.height / 2);

        // Jika mouse di atas titik tengah item ini, maka insert sebelum item ini
        if (mouseY < midPoint) {
            newIndex = i;
            break;
        }
    }

    dragState.placeholderIndex = newIndex;
};

const endDrag = () => {
    if (!dragState.isDragging) return;

    // Stop Scroll
    clearInterval(scrollInterval.value);

    // Lakukan Reordering Array
    const fromIndex = dragState.originalIndex;
    let toIndex = dragState.placeholderIndex;

    // Koreksi index jika memindahkan item dari atas ke bawah
    // Karena saat item diambil, index di bawahnya akan bergeser naik
    if (fromIndex < toIndex) {
        toIndex--;
    }

    // Manipulasi Array (Move Logic)
    const itemToMove = pages.value[fromIndex];
    pages.value.splice(fromIndex, 1);       // Hapus dari posisi lama
    pages.value.splice(toIndex, 0, itemToMove); // Insert di posisi baru

    // Reset State
    dragState.isDragging = false;
    dragState.originalIndex = -1;
    dragState.placeholderIndex = -1;
    // window.removeEventListener('mousemove', onMouseMove);
    // window.removeEventListener('mouseup', endDrag);
};

// Cleanup saat component destroyed
onUnmounted(() => {
    clearInterval(scrollInterval.value);
});

</script>

<style scoped>
.app-container {
    display: flex;
    height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    overflow: hidden;
    /* Penting agar body tidak scroll */
}

/* SIDEBAR STYLE */
.sidebar {
    width: 250px;
    background: #f0f0f0;
    border-right: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    /* Scrollable */
    padding: 10px;
    user-select: none;
    /* Biar teks ga ke-block saat drag */
}

.page-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 50px;
}

.page-item {
    background: white;
    height: 120px;
    /* Asumsi tinggi thumbnail */
    border: 2px solid #ddd;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
    position: relative;
}

.page-item:hover {
    border-color: #999;
}

.page-item.active {
    border-color: #3b82f6;
    background-color: #eff6ff;
}

.page-item.is-template {
    border-style: dashed;
    background-color: #fffbeb;
    /* Kuning tipis */
}

.page-item.is-template .badge {
    background: #f59e0b;
    color: white;
    padding: 2px 6px;
    font-size: 10px;
    border-radius: 4px;
    position: absolute;
    top: 5px;
    right: 5px;
}

/* DRAG STYLES */
.ghost-placeholder {
    opacity: 0.3;
    background: #ccc;
    border: 2px dashed #666;
}

.drag-ghost {
    position: fixed;
    pointer-events: none;
    /* Supaya event mouse tembus ke bawahnya */
    z-index: 9999;
    background: rgba(59, 130, 246, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%);
    /* Center cursor */
    font-weight: bold;
}

/* WORKSPACE STYLE */
.workspace {
    flex: 1;
    background: #e5e5e5;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.editor-area {
    background: white;
    flex: 1;
    padding: 40px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
}

.btn-set {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-unset {
    background: #ef4444;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.canvas-mock {
    flex: 1;
    background: #fafafa;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
}

.debug-info {
    background: #333;
    color: #0f0;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    border-radius: 4px;
}
</style>