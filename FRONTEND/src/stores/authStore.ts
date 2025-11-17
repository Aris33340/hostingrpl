// src/stores/authStore.ts

import { defineStore } from 'pinia';

// Definisikan tipe untuk data user (opsional tapi bagus)
interface UserState {
  access_token: string | null;
  role: string | null;
}

export const useAuthStore = defineStore('auth', {
  // 1. STATE
  // Ini adalah data yang kita simpan (di memori)
  state: (): UserState => ({
    access_token: null,
    role: null,
  }),

  // 2. GETTERS
  // Ini adalah 'computed properties' (data turunan)
  getters: {
    // Getter untuk tahu apakah user sudah login
    isAuthenticated: (state) => !!state.access_token,
    
    // Getter untuk header Authorization
    authHeader: (state) => {
      return { Authorization: `Bearer ${state.access_token}` };
    },
  },

  // 3. ACTIONS
  // Ini adalah fungsi untuk mengubah state
  actions: {
    /**
     * Menyimpan token dan role setelah login berhasil
     */
    setAuthData(token: string, userRole: string | null) {
      this.access_token = token;
      this.role = userRole;
    },

    /**
     * Menghapus data saat logout
     */
    clearAuthData() {
      this.access_token = null;
      this.role = null;
    },
  },
});