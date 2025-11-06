<template>
  <aside class="sidebar p-4 border-r border-gray-300 min-h-screen">
    <h2 class="text-lg font-bold mb-3">Menu</h2>
    <nav>
      <ul>
        <li 
          v-for="route in filteredRoutes" 
          :key="route.path" 
          class="mb-2"
        >
          <router-link
            :to="route.path"
            class="hover:text-blue-600"
            active-class="text-blue-600 font-bold"
          >
            {{ route.meta?.title || route.name }}
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const filteredRoutes = computed(() =>
  router.getRoutes().filter(r =>
    r.path && !r.path.includes(':') && r.meta?.title
  )
)
</script>

<style scoped>
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin: 12px 0;
}
</style>
