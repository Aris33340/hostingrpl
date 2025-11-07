import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import 'jquery/dist/jquery.min'
import 'popper.js/dist/popper.min'

const app = createApp(App);
app.use(router);
app.mount('#app');