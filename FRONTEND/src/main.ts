import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import 'jquery/dist/jquery.min'
import 'popper.js/dist/popper.min'
import '@tailwindplus/elements';



// 1. Impor Pinia
import { createPinia } from 'pinia'

const app = createApp(App);

// 2. Buat instance Pinia
const pinia = createPinia()

app.use(router);
app.use(pinia); // 3. Gunakan Pinia

app.mount('#app');