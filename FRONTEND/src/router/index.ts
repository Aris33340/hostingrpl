import { createRouter, createWebHistory } from "vue-router";
import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";
import PetugasDashboard from "../views/PetugasDashboard.vue";
import Editor from "../views/Editor.vue";

import { UserIcon, QrCodeIcon, UploadIcon } from "lucide-vue-next";
import { useAuthStore } from "../stores/authStore";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login", showNavbar: false },
  },
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
    meta: { title: "Editor STIS GRAD", icon: UserIcon, showInNavbar: true, requiresAuth: true, showNavbar:false },
    beforeEnter: (to:any, from:any, next:any) => {
      if(!to.query.fileId){
        next({ name: "FileManager" });
      }else{
        next();
      }
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component:NotFound,
    meta: { title: "Not Found", showNavbar: false },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.access_token ?? localStorage.getItem("access_token");
  console.log( localStorage.getItem("access_token"));
  console.log(authStore.access_token );

  if (to.path == '/'){
    return next("/login")
  }
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.path === "/login" && token) {
    return next("/manajemen-mahasiswa");
  }
  
  return next();
});

export default router;