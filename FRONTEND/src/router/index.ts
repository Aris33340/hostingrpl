import { createRouter, createWebHistory } from "vue-router";
import InputData from "../views/InputData.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";

// 🧩 Impor ikon (bisa SVG component, lucide-react, Heroicons, dll)
import { HomeIcon, FileTextIcon, QrCodeIcon, UploadIcon } from "lucide-vue-next";
import PetugasDashboard from "../views/PetugasDashboard.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { title: "Login", icon: HomeIcon, showInNavbar: true  },
  },
  {
    path: "/input-excel",
    name: "InputExcel",
    component: InputData,
    meta: { title: "Input Excel", icon: FileTextIcon, showInNavbar: true },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
