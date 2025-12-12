<template>
  <aside v-if="isNavbarVisible"
    class="left-0 top-0 shadow-lg flex flex-col items-center bg-transparent py-6 w-24 z-50 transition-all duration-300">
    <div class="w-full mb-6 text-center px-2">
      <span class="font-bold text-xs text-white truncate">Stis Grad</span>
    </div>

    <nav
      class="relative flex-1 flex bg-white p-3 rounded-full flex-col items-center space-y-4 w-12 sm:w-12 md:w-12 lg:w-16 px-2 transition-all duration-300 hover:scale-105">
      <router-link v-if="role === 'SUPERADMIN'" :to="'/super-admin-dashboard'"
        class="mt-auto group flex justify-center bottom-0">
        <div
          class="w-12 group h-12 flex rounded-full items-center justify-center transition-all duration-300 hover:bg-gray-300 hover:shadow-md text-gray-600 hover:text-gray-500">
          <StepBackIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        </div>
        <div
          class="absolute left-20 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
          Kembali ke SuperAdmin

        </div>
      </router-link>
      <SidebarLink v-for="route in menuRoutes" :key="route.path" :route="route" class="w-full mt-3" />
      <div class="flex-1"></div>
      <div class="flex flex-col gap-2">
        <router-link v-if="role === 'SUPERADMIN'" :to="'/settings'" class="mt-auto group flex justify-center bottom-0">
          <div
            class="w-12 h-12 flex rounded-full items-center justify-center transition-all duration-300 hover:bg-gray-300 hover:shadow-md hover:rotate-45 text-gray-600 hover:text-gray-500">
            <Settings class="w-5 h-5" />
          </div>
          <div
            class="absolute left-20 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
            Settings
          </div>
        </router-link>
        <button @click="handleLogout" class="group flex justify-center">
          <div
            class="w-12 h-12 flex rounded-full items-center justify-center transition-all duration-300 hover:bg-red-200 hover:shadow-md text-gray-600 hover:text-red-500">
            <LogOut class="w-5 h-5" />
          </div>
          <div
            class="absolute left-20 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
            Logout
          </div>
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LogOut, ArrowLeftCircle, Settings, StepBackIcon } from "lucide-vue-next";
import SidebarLink from "../components/SidebarLink.vue";
import { useAuthStore } from "../stores/authStore";
import logoImg from '@/assets/images/LogoStisGrad.png';
import { showNotification } from "../composables/useNotification";
import { isEmpty } from "class-validator";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const current_role = ref('')
const role = ref('')
const isNavbarVisible = computed(() => route.meta.showNavbar !== false);
const menuRoutes = computed(() => {
  const authStore = useAuthStore();
  try {
    current_role.value = isEmpty(authStore.current_role) ? authStore.getPayload().role : authStore.current_role;
    role.value = authStore.getPayload().role
  } catch (error) {
    // showNotification('warning',error.message)
  }
  const allMenus = router.getRoutes().filter(r => r.meta?.showInNavbar);
  const currentPath = route.path;
  console.log("all menus", allMenus)
  return allMenus.filter(menu => {
    if (menu.meta.allowedRoles) {
      const allowed = Array.isArray(menu.meta.allowedRoles)
        ? menu.meta.allowedRoles
        : Object.values(menu.meta.allowedRoles);
      console.log("allowed", allowed)
      console.log("current role", current_role.value)
      if (!allowed.includes(current_role.value)) return false;
    }
    return true;
  });
});
console.log("menuroutes", menuRoutes.value)


const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    authStore.logout();
  }
};
</script>
