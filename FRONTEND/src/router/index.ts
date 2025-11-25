<<<<<<< HEAD
import { createRouter, createWebHistory } from "vue-router";
=======
import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from "vue-router";

>>>>>>> origin/tya
import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";
import PetugasDashboard from "../views/PetugasDashboard.vue";
import Editor from "../views/Editor.vue";
<<<<<<< HEAD

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
=======
import ManajemenUndangan from "../views/ManajemenUndangan.vue";

import { UserIcon, QrCodeIcon, UploadIcon, MailIcon } from "lucide-vue-next";
import { useAuthStore } from "../stores/authStore";
import NotFound from "../views/NotFound.vue";

const routes = [
  // LOGIN
>>>>>>> origin/tya
  {
    path: "/login",
    name: "Login",
    component: Login,
<<<<<<< HEAD
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

=======
    meta: { title: "Login", showNavbar: false },
  },

  // DASHBOARD MAHASISWA
>>>>>>> origin/tya
  {
    path: "/manajemen-mahasiswa",
    name: "ManajemenMahasiswa",
    component: ManajemenMahasiswa,
    meta: { title: "Manajemen Mahasiswa", icon: UserIcon, showInNavbar: true, requiresAuth: true },
  },
<<<<<<< HEAD
=======

  // DASHBOARD UNDANGAN
  {
    path: "/manajemen-undangan",
    name: "ManajemenUndangan",
    component: ManajemenUndangan,
    meta: { title: "Manajemen Undangan", icon: MailIcon, showInNavbar: true, requiresAuth: true },
  },

  // UNDANGAN MAHASISWA
  {
    path: "/manajemen-undangan-mahasiswa",
    name: "ManajemenUndanganMahasiswa",
    component: () => import("../views/ManajemenUndanganMahasiswa.vue"),
    meta: { title: "Undangan Mahasiswa", showNavbar: false, requiresAuth: true },
  },

  // UNDANGAN TAMU
  {
    path: "/manajemen-undangan-tamu",
    name: "ManajemenUndanganTamu",
    component: () => import("../views/ManajemenUndanganTamu.vue"),
    meta: { title: "Undangan Tamu", showNavbar: false, requiresAuth: true },
  },

  // FILE MANAGER
>>>>>>> origin/tya
  {
    path: "/input-file",
    name: "FileManager",
    component: FileManager,
    meta: { title: "Input File", icon: UploadIcon, showInNavbar: true, requiresAuth: true },
  },
<<<<<<< HEAD
=======

  // QR
>>>>>>> origin/tya
  {
    path: "/generate-qr",
    name: "QrGenerator",
    component: QrGenerator,
    meta: { title: "Generate QR", icon: QrCodeIcon, showInNavbar: true, requiresAuth: true },
  },
<<<<<<< HEAD
=======

  // PETUGAS
>>>>>>> origin/tya
  {
    path: "/petugas",
    name: "DashboardPetugas",
    component: PetugasDashboard,
    meta: { title: "Dashboard Petugas Scanner", icon: QrCodeIcon, showInNavbar: true, requiresAuth: true },
  },
<<<<<<< HEAD
=======

  // EDITOR
>>>>>>> origin/tya
  {
    path: "/editor",
    name: "Editor STIS GRAD",
    component: Editor,
<<<<<<< HEAD
    meta: { title: "Editor STIS GRAD", icon: UserIcon, showInNavbar: true, requiresAuth: true, showNavbar: false },
    beforeEnter: (to: any, from: any, next: any) => {
=======
    meta: { title: "Editor STIS GRAD", icon: UserIcon, showNavbar: false, requiresAuth: true },
    beforeEnter: (to, _from, next) => {
>>>>>>> origin/tya
      if (!to.query.fileId) {
        next({ name: "FileManager" });
      } else {
        next();
      }
<<<<<<< HEAD
    }
  },
=======
    },
  },

  // NOT FOUND (HARUS PALING BAWAH)
>>>>>>> origin/tya
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { title: "Not Found", showNavbar: false },
<<<<<<< HEAD
  }
=======
  },
>>>>>>> origin/tya
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

<<<<<<< HEAD
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
=======
// =========================
// 🔐 ROUTER GUARD FINAL
// =========================
router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();
    const token = authStore.access_token ?? localStorage.getItem("access_token");

    // redirect root → /login
    if (to.path === "/") {
      return next("/login");
    }

    // butuh login tapi tidak ada token → lempar ke login
    if (to.meta.requiresAuth && !token) {
      return next("/login");
    }

    // jika sudah login tapi buka /login → redirect ke dashboard
    if (to.path === "/login" && token) {
      return next("/manajemen-mahasiswa");
    }

    return next();
  }
);

export default router;
>>>>>>> origin/tya
