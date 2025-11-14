<template>
  <aside v-if="isNavbarVisible"
    class="fixed left-0 top-0 h-full shadow-lg flex flex-col items-center py-6 w-16 z-50 transition-all duration-300">
    <div class="w-full mb-6 text-center px-2">
      <span class="font-bold text-xs text-white truncate">Stis Grad</span>
    </div>

    <nav class="flex-1 flex bg-white rounded-full flex-col items-center space-y-4 w-12 sm:w-12 md:w-12 lg:w-12 px-2">
      <SidebarLink v-for="route in menuRoutes" :key="route.path" :route="route" class="w-full mt-3" />

      <button @click="handleLogout" class="mt-auto absolute group flex justify-center bottom-3">
        <div
          class="w-12 h-12 flex rounded-full items-center justify-center transition-all duration-300 hover:bg-red-50 hover:shadow-md text-gray-600 hover:text-red-500">
          <LogOut class="w-5 h-5" />
        </div>
        <div
          class="absolute w-12 h-12 left-20 bottom-12 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
          Logout
        </div>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LogOut } from "lucide-vue-next";
import SidebarLink from "../components/Button.vue";

const router = useRouter();
const route = useRoute();

const isNavbarVisible = computed(() => route.meta.showNavbar !== false);
console.log(isNavbarVisible.value)

const menuRoutes = computed(() =>
  router.getRoutes().filter((r) => r.meta.showInNavbar)
);

const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    localStorage.removeItem("token");
    router.push("/login");
  }
};
</script>

<style scoped>
@media (max-width: 768px) {
  aside {
    width: 60px;
    padding: 0.5rem 0;
  }

  aside .mb-6 {
    display: none;
  }

  aside nav {
    space-y: 2;
  }

  button div {
    width: 10;
    height: 10;
  }
}
</style>
