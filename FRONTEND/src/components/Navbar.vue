<template>
  <aside class="ml-5 left-0 top-0 w-24 shadow-lg flex flex-col items-center py-6 z-50 ">
    <div class="w-full mb-6 text-center">
      <span class="font-bold text-lg text-white">Stis Grad</span>
    </div>

    <nav class="mb-10 relative flex-1 flex flex-col items-center space-y-6 bg-gray-200 p-4 rounded-full">
      <SidebarLink v-for="route in menuRoutes" :key="route.path" :route="route" />

      <button @click="handleLogout" class="absolute bottom-10 mt-auto mb-10 group w-full">
        <div
          class="w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-red-50 hover:shadow-md text-gray-600 hover:text-red-500">
          <LogOut class="w-6 h-6" />
        </div>
        <div
          class="absolute left-20 bottom-14 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
          Logout
        </div>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LogOut } from "lucide-vue-next";
import SidebarLink from '../components/Button.vue'

const router = useRouter();
const route = useRoute();

const menuRoutes = computed(() =>
  router.getRoutes().filter((r) => r.meta.showInNavbar)
);

const isActive = (path) => route.path === path;

const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    localStorage.removeItem("token");
    router.push("/login");
  }
};
</script>
