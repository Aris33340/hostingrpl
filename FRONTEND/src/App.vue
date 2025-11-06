<template>
  <div id="app" class="app-layout">
    <Navbar />

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.main-content {
  flex: 1;
  width: 100vw;
  padding: 20px;
  background-color: #8f8f8f;
}
</style>
