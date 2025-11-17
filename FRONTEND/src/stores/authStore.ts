// src/stores/authStore.ts

import { defineStore } from 'pinia';

// Definisikan tipe untuk data user (opsional tapi bagus)
interface UserState {
  access_token: string | null;
  role: string | null;
  id: number | null;
  remember: boolean;
}

export const useAuthStore = defineStore('auth', {
  // 1. STATE
  // Ini adalah data yang kita simpan (di memori)
  state: (): UserState => ({
    access_token: null,
    role: null,
    id: null,
    remember:false,
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
    setAuthData(token: string, userRole: string, userId:number, remember: boolean) {
      this.access_token = token;
      this.role = userRole;
      this.id = userId;
      this.remember = remember;
      if (this.remember) {  
        // Simpan persisten
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_role", userRole);
        localStorage.setItem("user_id", String(userId));
      } else {
        // Pastikan tidak ada sisa data
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");
      }
    },
    loadFromLocalStorage() {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("user_role");
      const id = localStorage.getItem("user_id");
      
      if (token) {
        this.access_token = token;
        this.role = role;
        this.id = Number(id);
      }
    },

    /**
     * Menghapus data saat logout
    */
    clearAuthData() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      this.access_token = null;
      this.role = null;
      this.id = null;
    },
  },
});