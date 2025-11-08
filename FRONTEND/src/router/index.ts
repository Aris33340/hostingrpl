import { createRouter, createWebHistory } from "vue-router";
import ManajemenMahasiswa from "../views/ManajemenMahasiswa.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";

// 🧩 Impor ikon (bisa SVG component, lucide-react, Heroicons, dll)
import { HomeIcon, UserIcon, QrCodeIcon, UploadIcon } from "lucide-vue-next";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { title: "Login", showInNavbar: false },
  },
  {
    path: "/manajemen-mahasiswa",
    name: "ManajemenMahasiswa",
    component: ManajemenMahasiswa,
    meta: { title: "Manajemen Mahasiswa", icon: UserIcon, showInNavbar: true },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
