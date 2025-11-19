import axios from 'axios'

import { useAuthStore } from '../stores/authStore'

const mainApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
})



mainApi.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  Object.assign(config.headers, authStore.authHeader);
  return config;
});



mainApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {

        await authStore.refresh();
        Object.assign(originalRequest.headers, authStore.authHeader);

        return mainApi(originalRequest);
      } catch (refreshError) {
        authStore.clearAuthData();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default mainApi