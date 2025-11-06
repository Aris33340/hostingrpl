import { createRouter, createWebHistory } from 'vue-router';
import InputData from '../views/InputData.vue';
import Login from '../views/Login.vue';
import QrGenerator from '../components/QrGenerator.vue';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: Login, 
    meta: { title: 'Login' } 
  },
  { 
    path: '/input-data', 
    name: 'InputData', 
    component: InputData, 
    meta: { title: 'Input Data' } 
  },
  { 
    path: '/generate-qr', 
    name: 'QrGenerator', 
    component: QrGenerator, 
    meta: { title: 'Generate QR' } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
