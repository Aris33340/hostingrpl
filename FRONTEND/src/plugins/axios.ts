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
apiClient.interceptors.response.use(
  (response) => {
    // Jika response sukses, langsung kembalikan
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Cek jika error 401 (Unauthorized) & belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Tandai bahwa kita sudah retry

      try {
        // Panggil endpoint /refresh di backend
        const response = await apiClient.post('/auth/refresh');
        
        // Backend mengirim access_token baru
        const newAccessToken = response.data.access_token;
        
        // Simpan token baru di Pinia store
        authStore.setAuthData(newAccessToken, authStore.role); // Role tetap sama

        // Perbarui header di request asli dengan token baru
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Ulangi request asli (yang tadi gagal)
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Jika refresh gagal (misal: refresh token kedaluwarsa)
        // Hapus data user dan lempar ke halaman login
        authStore.clearAuthData();
        
        // Arahkan ke halaman login
        // (Kita tidak bisa pakai useRouter() di sini, jadi pakai window.location)
        window.location.href = '/'; 
        
        return Promise.reject(refreshError);
      }
    }

    // Untuk error selain 401, lempar saja errornya
    return Promise.reject(error);
  }
);

// Ekspor instance yang sudah dikonfigurasi
export default apiClient;