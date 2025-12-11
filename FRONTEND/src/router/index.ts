import { 
  createRouter, 
  createWebHistory, 
  type RouteLocationNormalized, 
  type NavigationGuardNext 
} from "vue-router";


import { useAuthStore } from "../stores/authStore";

import ManajemenPeserta from "../views/ManajemenPeserta.vue";
import Login from "../views/Login.vue";
import FileManager from "../views/FileManager.vue";
import DashboardPetugas from "../views/DashboardPetugas.vue";
import Editor from "../views/Editor.vue";
import ManajemenUndangan from "../views/ManajemenUndangan.vue";
import TulisUndangan from "../views/TulisUndangan.vue"; // <-- IMPORT BARU
import SuperAdminDashboard from "../views/SuperAdminDashboard.vue";
import DashboardSekre from "../views/DashboardSekre.vue";
import DashboardBuku from "../views/DashboardBuku.vue";
import NotFound from "../views/NotFound.vue";
import Test from "../views/Test.vue";
import BlankPage from "../views/BlankPage.vue";
import Settings from "../views/Settings.vue";

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
    meta: {
      title: "Login",
      showTopbar:false,
      showNavbar: false,
      requiresAuth: false
    },
  },
  {
    path: "/test",
    name: "Testing",
    component: Test,
    meta: {
      title: "Test",
      showNavbar: true,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN"]
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    meta: {
      title: "Test",
      showNavbar: true,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN","SEKRETARIAT"]
    },
  },
  // --- 2. ROUTE UTAMA SUPER ADMIN ---
  {
    path: "/super-admin-dashboard",
    name: "SuperAdmin Dashboard",
    component: SuperAdminDashboard,
    meta: {
      title: "Super Admin",
      showNavbar: false,
      showTopbar:false,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN"]
    },
  },
  {
    path: "/",
    name: "blank page",
    component: BlankPage,
    meta: {
      title: "blank",
      showNavbar: false,
      requiresAuth: true,
      allowedRoles: []
    },
  },

  // --- DASHBOARD KESEKRETARIATAN ---
  {
    path: "/dashboard-sekre",
    name: "Dashboard Sekre",
    component: DashboardSekre,
    meta: {
      title: "Beranda",
      icon: HomeIcon,
      showInNavbar: true,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN","SEKRETARIAT"]
    },
  },

  // --- 4. DASHBOARD BUKU WISUDA ---
  {
    path: "/dashboard-buku",
    name: "Dashboard Buku",
    component: DashboardBuku,
    meta: {
      title: "Beranda Buku",
      icon: HomeIcon,
      showInNavbar: true,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN","BUKUWISUDA"]
    },
  },

  // MANAJEMEN MAHASISWA
  {
    path: "/manajemen-peserta",
    name: "Manajemen Peserta",
    component: ManajemenPeserta,
    meta: {
      title: "Manajemen Peserta",
      icon: UserIcon,
      showInNavbar: true,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN","SEKRETARIAT","BUKUWISUDA"]
    },
  },
  {
    path: "/input-file",
    name: "File Manager",
    component: FileManager,
    meta: {
      title: "Manajemen File",
      icon: UploadIcon,
      showInNavbar: true,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN","BUKUWISUDA","SEKRETARIAT"]
    },
  },
  {
    path: "/manajemen-undangan",
    name: "Manajemen Undangan",
    component: ManajemenUndangan,
    meta: {
      title: "Manajemen Undangan",
      icon: MailIcon, showInNavbar: true,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN","SEKRETARIAT","BUKUWISUDA"]
    },
  },
  {
    path: "/tulis-undangan/:folderName", // Menerima parameter nama folder
    name: "TulisUndangan",
    component: TulisUndangan,
    props: true,
    meta: {
      title: "Tulis Undangan",
      showNavbar: false,
      requiresAuth: true,
      allowedRoles: ["SUPERADMIN","SEKRETARIAT","BUKUWISUDA"]
    },
  },
  {
    path: "/petugas",
    name: "Dashboard Petugas",
    component: DashboardPetugas,
    meta: {
      title: "Dashboard Petugas Scanner",
      icon: QrCodeIcon,
      showInNavbar: true,
      requiresAuth: true,
      allowedRoles: ["PETUGAS","SEKRETARIAT","SUPERADMIN"]
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
      showInNavbar: false,
      requiresAuth: true,
      showNavbar: false,
      allowedRoles: ["SUPERADMIN","BUKUWISUDA","SEKRETARIAT"]
    },
    beforeEnter: (to: any, from: any, next: any) => {
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


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isAuth()
  let userRole;
  function getDefaultRouteByRole(role:any) {
    switch (role) {
      case "SUPERADMIN":
        return "/super-admin-dashboard";
      case "SEKRETARIAT":
        return "/dashboard-sekre";
      case "BUKUWISUDA":
        return "/dashboard-buku";
      case "PETUGAS":
        return "/petugas";
      default:
        return "/login";
    }
  }

  if (to.meta.requiresAuth && !isAuth) {
    return next({ path: "/login" });
  }

  if (to.meta.allowedRoles) {
    try {
      const payload = authStore.getPayload();
      userRole = payload.role;
      const allowedRoles = Array.isArray(to.meta.allowedRoles) ? to.meta.allowedRoles : Object.values(to.meta.allowedRoles);
      const allowed = allowedRoles.includes(userRole)
      if (!allowed) {
        return next(getDefaultRouteByRole(userRole));
      }
    } catch (e) {
      authStore.clearAuthData();
      return next({ path: "/login" });
    }
  }

  if (isAuth) {
    if (to.path === "/" && userRole !== "SUPERADMIN") {
       return next("/login");
    }
  }
  return next();
});

export default router;