import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from "vue-router";

import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";
import PetugasDashboard from "../views/PetugasDashboard.vue";
import Editor from "../views/Editor.vue";
import ManajemenUndangan from "../views/ManajemenUndangan.vue";
import TulisUndangan from "../views/TulisUndangan.vue"; // <-- IMPORT BARU

import SuperAdminDashboard from "../views/SuperAdminDashboard.vue";
import DashboardSekre from "../views/DashboardSekre.vue";
import DashboardBuku from "../views/DashboardBuku.vue";
import { UserIcon, QrCodeIcon, UploadIcon, MailIcon, HomeIcon } from "lucide-vue-next";
import { useAuthStore } from "../stores/authStore";
import NotFound from "../views/NotFound.vue";
import Test from "../views/Test.vue";

const routes = [
  // LOGIN
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login", showNavbar: false, requiresAuth: false },
  },
  {
    path: "/test",
    name: "Testing",
    component: Test,
    meta: { title: "Test", showNavbar: true, requiresAuth: true },
  },
  // --- 2. ROUTE UTAMA SUPER ADMIN ---
  {
    path: "/",
    name: "SuperAdminDashboard",
    component: SuperAdminDashboard,
    meta: { title: "Super Admin", showNavbar: false, requiresAuth: true },
  },

  // --- 3. DASHBOARD KESEKRETARIATAN ---
  {
    path: "/dashboard-sekre",
    name: "DashboardSekre",
    component: DashboardSekre,
    meta: { title: "Beranda", icon: HomeIcon, showInNavbar: true, requiresAuth: true },
  },

  // --- 4. DASHBOARD BUKU WISUDA ---
  {
    path: "/dashboard-buku",
    name: "DashboardBuku",
    component: DashboardBuku,
    meta: { title: "Beranda Buku", icon: HomeIcon, showInNavbar: true, requiresAuth: true },
  },

  {
    path: "/manajemen-mahasiswa",
    name: "ManajemenMahasiswa",
    component: ManajemenMahasiswa,
    meta: { title: "Manajemen Mahasiswa", icon: UserIcon, showInNavbar: true, requiresAuth: true },
  },

  // DASHBOARD UNDANGAN (TAB MENU)
  {
    path: "/manajemen-undangan",
    name: "ManajemenUndangan",
    component: ManajemenUndangan,
    meta: { title: "Manajemen Undangan", icon: MailIcon, showInNavbar: true, requiresAuth: true },
  },

  // --- HALAMAN TULIS UNDANGAN DINAMIS ---
  {
    path: "/tulis-undangan/:folderName", // Menerima parameter nama folder
    name: "TulisUndangan",
    component: TulisUndangan,
    props: true,
    meta: { title: "Tulis Undangan", showNavbar: false, requiresAuth: true },
  },

  // FILE MANAGER
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
    meta: { title: "Editor STIS GRAD", icon: UserIcon, showInNavbar: false, requiresAuth: true, showNavbar: false },
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