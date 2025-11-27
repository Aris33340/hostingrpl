<template>
  <aside v-if="isNavbarVisible"
    class="left-0 top-0 h-full shadow-lg flex flex-col items-center py-6 w-16 z-50 transition-all duration-300">
    <div class="w-full mb-6 text-center px-2">
      <span class="font-bold text-xs text-white truncate">Stis Grad</span>
    </div>

    <nav
      class="relative flex-1 flex bg-white rounded-full flex-col items-center space-y-4 w-12 sm:w-12 md:w-12 lg:w-12 px-2 transition-all duration-300 hover:scale-105">
      <SidebarLink v-for="route in menuRoutes" :key="route.path" :route="route" class="w-full mt-3" />

      <button @click="handleLogout" class="mt-auto absolute group flex justify-center bottom-0">
        <div
          class="w-12 h-12 flex rounded-full items-center justify-center transition-all duration-300 hover:bg-red-50 hover:shadow-md text-gray-600 hover:text-red-500">
          <LogOut class="w-5 h-5" />
        </div>
        <div 
          class="absolute w-12 h-12 left-20 bottom-12 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
          Logout
        </div>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LogOut, ArrowLeftCircle } from "lucide-vue-next"; // Tambah icon Back
import SidebarLink from "../components/Button.vue";
import { useAuthStore } from "../stores/authStore";
import logoImg from '@/assets/images/LogoStisGrad.png';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isNavbarVisible = computed(() => route.meta.showNavbar !== false);

// --- LOGIKA FILTER MENU YANG DIPERBAIKI ---
const menuRoutes = computed(() => {
  // 1. Ambil semua menu yang di-set tampil di navbar
  const allMenus = router.getRoutes().filter((r) => r.meta && r.meta.showInNavbar);

  // 2. Ambil path URL saat ini
  const currentPath = route.path;

  // 3. Filter ketat
  return allMenus.filter((menu) => {

    // KASUS A: Menu ini adalah "Beranda Buku Wisuda"
    if (menu.name === 'DashboardBuku') {
      // HANYA TAMPILKAN jika URL mengandung 'dashboard-buku'
      return currentPath.includes('dashboard-buku');
    }

    // KASUS B: Menu ini adalah "Beranda Kesekretariatan"
    if (menu.name === 'DashboardSekre') {
      // SEMBUNYIKAN jika URL mengandung 'dashboard-buku'
      // (Artinya: Tampilkan hanya jika KITA TIDAK SEDANG di buku wisuda)
      return !currentPath.includes('dashboard-buku');
    }

    // KASUS C: Menu lainnya (Mahasiswa, QR, dll) -> Tampilkan selalu
    return true;
  });
});

// Fungsi untuk kembali ke Halaman Pilih Modul (Super Admin Dashboard)

const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    authStore.logout();
  }
};
</script>
