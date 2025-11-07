import { createRouter, createWebHistory } from "vue-router";
import InputData from "../views/InputData.vue";
import Login from "../views/Login.vue";
import QrGenerator from "../components/QrGenerator.vue";
import FileManager from "../views/FileManager.vue";

// 🧩 Impor ikon (bisa SVG component, lucide-react, Heroicons, dll)
import { HomeIcon, FileTextIcon, QrCodeIcon, UploadIcon } from "lucide-vue-next";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { title: "Login", showInNavbar: false },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
