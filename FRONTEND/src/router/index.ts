import { createRouter, createWebHistory } from "vue-router";
import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";
import PetugasDashboard from "../views/PetugasDashboard.vue";

import { HomeIcon, UserIcon, QrCodeIcon, UploadIcon } from "lucide-vue-next";
import Test from "../views/Test.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { title: "Login", icon: HomeIcon, showInNavbar: true, showNavbar:false },
  },
  {
    path: "/manajemen-mahasiswa",
    name: "ManajemenMahasiswa",
    component: ManajemenMahasiswa,
    meta: { title: "Manajemen Mahasiswa", icon: UserIcon, showInNavbar: true},
  },
  {
    path: "/input-file",
    name: "InputFile",
    component: FileManager,
    meta: { title: "Input File", icon: UploadIcon, showInNavbar: true },
  },
  {
    path: "/generate-qr",
    name: "QrGenerator",
    component: QrGenerator,
    meta: { title: "Generate QR", icon: QrCodeIcon, showInNavbar: true },
  },
  {
    path: "/petugas",
    name: "DashboardPetugas",
    component: PetugasDashboard,
    meta: { title: "Dashboard Petugas Scanner", icon: QrCodeIcon, showInNavbar: true },
  },
  {
    path: "/test",
    name: "testing",
    component: Test,
    meta: { title: "Dashboard Petugas Scanner", icon: QrCodeIcon, showInNavbar: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: Login,
    meta: { title: "Not Found", icon: HomeIcon, showInNavbar: false, showNavbar:false },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;