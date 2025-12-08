import { 
  createRouter, 
  createWebHistory, 
  type RouteLocationNormalized, 
  type NavigationGuardNext 
} from "vue-router";


import { useAuthStore } from "../stores/authStore";

import Login from "../views/Login.vue";
import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";
import PetugasDashboard from "../views/PetugasDashboard.vue";
import Editor from "../views/Editor.vue";
import ManajemenUndangan from "../views/ManajemenUndangan.vue";
import SuperAdminDashboard from "../views/SuperAdminDashboard.vue";
import DashboardSekre from "../views/DashboardSekre.vue";
import DashboardBuku from "../views/DashboardBuku.vue";
import NotFound from "../views/NotFound.vue";

import {
  UserIcon,
  QrCodeIcon,
  UploadIcon,
  MailIcon,
  HomeIcon,
} from "lucide-vue-next";

const routes = [
  // LOGIN
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login", showNavbar: false, requiresAuth: false },
  },

  // --- SUPER ADMIN (PILIH AKTOR) ---
  {
    path: "/",
    name: "SuperAdminDashboard",
    component: SuperAdminDashboard,
    meta: {
      title: "Super Admin",
      showNavbar: false,
      requiresAuth: true,
    },
  },

  // --- DASHBOARD KESEKRETARIATAN ---
  {
    path: "/dashboard-sekre",
    name: "DashboardSekre",
    component: DashboardSekre,
    meta: {
      title: "Beranda",
      icon: HomeIcon,
      showInNavbar: true,
      requiresAuth: true,
    },
  },

  // --- DASHBOARD BUKU WISUDA ---
  {
    path: "/dashboard-buku",
    name: "DashboardBuku",
    component: DashboardBuku,
    meta: {
      title: "Beranda Buku Wisuda",
      icon: HomeIcon,
      showInNavbar: true,
      requiresAuth: true,
    },
  },

  // MANAJEMEN MAHASISWA
  {
    path: "/manajemen-mahasiswa",
    name: "ManajemenMahasiswa",
    component: ManajemenMahasiswa,
    meta: {
      title: "Manajemen Mahasiswa",
      icon: UserIcon,
      showInNavbar: true,
      requiresAuth: true,
    },
  },

  // MANAJEMEN UNDANGAN
  {
    path: "/manajemen-undangan",
    name: "ManajemenUndangan",
    component: ManajemenUndangan,
    meta: {
      title: "Manajemen Undangan",
      icon: MailIcon,
      showInNavbar: true,
      requiresAuth: true,
    },
  },

  // FILE
  {
    path: "/input-file",
    name: "FileManager",
    component: FileManager,
    meta: {
      title: "Input File",
      icon: UploadIcon,
      showInNavbar: true,
      requiresAuth: true,
    },
  },

  // QR
  {
    path: "/generate-qr",
    name: "QrGenerator",
    component: QrGenerator,
    meta: {
      title: "Generate QR",
      icon: QrCodeIcon,
      showInNavbar: true,
      requiresAuth: true,
    },
  },

  // PETUGAS SCANNER
  {
    path: "/petugas",
    name: "DashboardPetugas",
    component: PetugasDashboard,
    meta: {
      title: "Dashboard Petugas Scanner",
      icon: QrCodeIcon,
      showInNavbar: true,
      requiresAuth: true,
    },
  },

  // EDITOR
  {
    path: "/editor",
    name: "Editor STIS GRAD",
    component: Editor,
    meta: {
      title: "Editor STIS GRAD",
      icon: UserIcon,
      showInNavbar: true,
      requiresAuth: true,
      showNavbar: false,
    },
    // Menambahkan tipe data untuk to, from, next
    beforeEnter: (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (!to.query.fileId) {
        next({ name: "FileManager" });
      } else {
        next();
      }
    },
  },

  // NOT FOUND
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { title: "Not Found", showNavbar: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * GLOBAL GUARD
 */
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isAuthenticated;
  const userRole = authStore.user?.role; 

  // 1. Cek jika butuh login tapi belum login
  if (to.meta.requiresAuth && !isAuth) {
    return next("/login");
  }

  // 2. Logika jika user SUDAH LOGIN
  if (isAuth) {
    
    if (to.path === "/" && userRole !== "SUPERADMIN") {
       return next("/login");
    }
  }

  return next();
});

export default router;