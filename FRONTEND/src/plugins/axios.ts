// src/plugins/axios.ts

import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// 1. Buat instance Axios baru
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // URL Backend Anda
  withCredentials: true, // WAJIB agar cookie (refresh token) terkirim
});

// 2. Request Interceptor (Berjalan SEBELUM request dikirim)
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    
    // Jika token ada, tambahkan ke header Authorization
    if (authStore.access_token) {
      config.headers['Authorization'] = `Bearer ${authStore.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Berjalan SETELAH response diterima)
// Ini adalah logika untuk me-refresh token secara otomatis


// Ekspor instance yang sudah dikonfigurasi
export default apiClient;