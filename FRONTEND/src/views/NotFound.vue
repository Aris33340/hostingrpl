<template>
    <div class="notfound-page z-20 absolute top-0 left-0 bottom-0 right-0">
        <div class="card">
            <h1 class="code">404</h1>
            <h2 class="title">Halaman Tidak Ditemukan</h2>
            <p class="message">
                Maaf, halaman yang Anda cari tidak tersedia. Mungkin URL salah ketik atau
                halaman sudah dipindahkan.
            </p>

            <div class="actions">
                <button @click="goHome" class="btn primary">Kembali ke Beranda</button>
                <button @click="goBack" class="btn ghost">Kembali</button>
            </div>

            <p class="hint" v-if="path">Attempted: <code>{{ path }}</code></p>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const path = route.fullPath || '';

function goHome() {
    router.push({ name: 'ManajemenMahasiswa' }).catch(() => { });
}

function goBack() {
    router.back();
}
</script>

<style scoped>
.notfound-page {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(180deg, #f8fafc, #eef2f7);
    font-family: Inter, Roboto, system-ui, -apple-system, "Segoe UI", Arial;
}

.card {
    text-align: center;
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(16, 24, 40, 0.08);
    max-width: 720px;
    width: 100%;
}

.code {
    font-size: 4.5rem;
    margin: 0;
    color: #0f172a;
    font-weight: 700;
}

.title {
    margin: 0.5rem 0 0.25rem;
    font-size: 1.5rem;
    color: #0f172a;
}

.message {
    color: #475569;
    margin-bottom: 1.5rem;
}

.actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1rem;
}

.btn {
    padding: 0.6rem 1.1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.btn.primary {
    background: linear-gradient(90deg, #06b6d4, #0891b2);
    color: white;
}

.btn.ghost {
    background: transparent;
    color: #0f172a;
    border: 1px solid rgba(15, 23, 42, 0.08);
}

.hint {
    margin-top: 0.75rem;
    color: #94a3b8;
    font-size: 0.9rem;
    word-break: break-all;
}
</style>