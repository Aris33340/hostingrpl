<template>
  <div :class="cardClasses"
    class="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium opacity-80 mb-1">{{ message }}</p>
        <div v-if="loading" class="flex items-center h-10">
          <svg class="animate-spin h-6 w-6 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span class="text-white/80 text-sm">Memuat...</span>
        </div>
        <p v-else class="text-4xl font-bold">{{ formattedValue }}</p>
      </div>
      <div :class="iconClasses" class="w-16 h-16 rounded-2xl flex items-center justify-center">
        <component :is="iconComponent" class="w-8 h-8" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Users, CheckCircle, Clock } from 'lucide-vue-next';

const props = defineProps({
  value: { type: Number, default: 0 },
  message: { type: String, default: "Data" },
  icon: { type: String, default: "users" },
  color: { type: String, default: "blue" },
  loading: { type: Boolean, default: false }
});

const formattedValue = computed(() => {
  return props.value.toLocaleString('id-ID');
});

const iconComponent = computed(() => {
  const icons = {
    users: Users,
    check: CheckCircle,
    clock: Clock
  };
  return icons[props.icon] || Users;
});

const cardClasses = computed(() => {
  const colors = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    green: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
  };
  return `p-6 ${colors[props.color] || colors.blue}`;
});

const iconClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-400/30',
    green: 'bg-green-400/30',
    orange: 'bg-orange-400/30'
  };
  return colors[props.color] || colors.blue;
});
</script>