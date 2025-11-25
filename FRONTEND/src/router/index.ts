import { createRouter, createWebHistory } from "vue-router";
import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";
import PetugasDashboard from "../views/PetugasDashboard.vue";
import Editor from "../views/Editor.vue";

// --- 1. IMPORT VIEWS DASHBOARD ---
import SuperAdminDashboard from "../views/SuperAdminDashboard.vue";
import DashboardSekre from "../views/DashboardSekre.vue";
import DashboardBuku from "../views/DashboardBuku.vue"; // <--- TAMBAHAN BARU: Import Dashboard Buku
import { UserIcon, QrCodeIcon, UploadIcon, HomeIcon } from "lucide-vue-next";
// --------------------------------

import { useAuthStore } from "../stores/authStore";
import NotFound from "../views/NotFound.vue";
import Test from "../views/Test.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login", showNavbar: false, requiresAuth: false },
  },

  // --- 2. ROUTE UTAMA SUPER ADMIN (PILIH AKTOR) ---
  {
    path: "/",
    name: "SuperAdminDashboard",
    component: SuperAdminDashboard,
    // showNavbar: false agar layar penuh saat memilih aktor
    meta: { title: "Super Admin", showNavbar: false, requiresAuth: true },
  },

  // --- 3. DASHBOARD KESEKRETARIATAN ---
  {
    path: "/dashboard-sekre",
    name: "DashboardSekre",
    component: DashboardSekre,
    // showInNavbar: true agar muncul 'Beranda' di sidebar saat masuk sini
    meta: { title: "Beranda", icon: HomeIcon, showInNavbar: true, requiresAuth: true },
  },

  // --- 4. DASHBOARD BUKU WISUDA (UPDATE BARU) ---
  {
    path: "/dashboard-buku",
    name: "DashboardBuku",
    component: DashboardBuku, // Sekarang mengarah ke file DashboardBuku.vue yang benar
    // showInNavbar: true agar muncul 'Beranda' di sidebar saat masuk sini
    meta: { title: "Beranda Buku", icon: HomeIcon, showInNavbar: true, requiresAuth: true },
  },
  // -------------------------------------------

  {
    path: "/manajemen-mahasiswa",
    name: "ManajemenMahasiswa",
    component: ManajemenMahasiswa,
    meta: { title: "Manajemen Mahasiswa", icon: UserIcon, showInNavbar: true, requiresAuth: true },
  },
  {
    path: "/input-file",
    name: "FileManager",
    component: FileManager,
    meta: { title: "Input File", icon: UploadIcon, showInNavbar: true, requiresAuth: true },
  },
  {
    path: "/generate-qr",
    name: "QrGenerator",
    component: QrGenerator,
    meta: { title: "Generate QR", icon: QrCodeIcon, showInNavbar: true, requiresAuth: true },
  },
  {
    path: "/petugas",
    name: "DashboardPetugas",
    component: PetugasDashboard,
    meta: { title: "Dashboard Petugas Scanner", icon: QrCodeIcon, showInNavbar: true, requiresAuth: true },
  },
  {
    path: "/editor",
    name: "Editor STIS GRAD",
    component: Editor,
    meta: { title: "Editor STIS GRAD", icon: UserIcon, showInNavbar: true, requiresAuth: true, showNavbar: false },
    beforeEnter: (to: any, from: any, next: any) => {
      if (!to.query.fileId) {
        next({ name: "FileManager" });
      } else {
        next();
      }
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { title: "Not Found", showNavbar: false },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuth) {
    return next("/login");
  }

  if (to.path === "/login" && isAuth) {
    return next("/");
  }

  return next();
});

export default router;