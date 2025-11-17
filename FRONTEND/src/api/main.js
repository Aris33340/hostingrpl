import axios from 'axios'
import authApi from './auth'
import { useAuthStore } from '../stores/authStore'

const mainApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,withCredentials:true // base endpoint untuk main api
})

mainApi.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const access_token = authStore.access_token ?? localStorage.getItem('access_token');

  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

mainApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await authApi.post('/refresh');
        const newAccessToken = response.data.access_token;

        authStore.setAuthData(newAccessToken, authStore.role,authStore.$id, authStore.remember);

        // Perbarui header di request asli dengan token baru
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Ulangi request asli (yang tadi gagal)
        return mainApi(originalRequest);
      } catch (refreshError) {
        // Jika refresh gagal (misal: refresh token kedaluwarsa)
        // Hapus data user dan lempar ke halaman login
        authStore.clearAuthData();
        // Arahkan ke halaman login
        // (Kita tidak bisa pakai useRouter() di sini, jadi pakai window.location)
        console.log(refreshError.message)
        return Promise.reject(refreshError);
      }
    }

    // Untuk error selain 401, lempar saja errornya
    return Promise.reject(error);
  }
);

export default mainApi