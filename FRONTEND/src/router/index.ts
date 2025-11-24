import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from "vue-router";

import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";
import PetugasDashboard from "../views/PetugasDashboard.vue";
import Editor from "../views/Editor.vue";
import ManajemenUndangan from "../views/ManajemenUndangan.vue";

import { UserIcon, QrCodeIcon, UploadIcon, MailIcon } from "lucide-vue-next";
import { useAuthStore } from "../stores/authStore";
import NotFound from "../views/NotFound.vue";

const routes = [
  // LOGIN
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login", showNavbar: false },
  },

  // DASHBOARD MAHASISWA
  {
    path: "/manajemen-mahasiswa",
    name: "ManajemenMahasiswa",
    component: ManajemenMahasiswa,
    meta: { title: "Manajemen Mahasiswa", icon: UserIcon, showInNavbar: true, requiresAuth: true },
  },

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
  {
    path: "/input-file",
    name: "FileManager",
    component: FileManager,
    meta: { title: "Input File", icon: UploadIcon, showInNavbar: true, requiresAuth: true },
  },

  // QR
  {
    path: "/generate-qr",
    name: "QrGenerator",
    component: QrGenerator,
    meta: { title: "Generate QR", icon: QrCodeIcon, showInNavbar: true, requiresAuth: true },
  },

  // PETUGAS
  {
    path: "/petugas",
    name: "DashboardPetugas",
    component: PetugasDashboard,
    meta: { title: "Dashboard Petugas Scanner", icon: QrCodeIcon, showInNavbar: true, requiresAuth: true },
  },

  // EDITOR
  {
    path: "/editor",
    name: "Editor STIS GRAD",
    component: Editor,
    meta: { title: "Editor STIS GRAD", icon: UserIcon, showNavbar: false, requiresAuth: true },
    beforeEnter: (to, _from, next) => {
      if (!to.query.fileId) {
        next({ name: "FileManager" });
      } else {
        next();
      }
    },
  },

  // NOT FOUND (HARUS PALING BAWAH)
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
