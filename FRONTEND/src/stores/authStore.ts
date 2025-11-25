// src/stores/authStore.ts

import { defineStore } from 'pinia';
<<<<<<< HEAD
import { authApi } from '../api';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';
// import type { PdfEditRequestDto, EditablePage, EditorElement } from '@/types/editorDto';



interface MyJwtPayload extends JwtPayload {
  email: string;
  role: string;
  sub: string | undefined;
}

interface UserState {
  access_token: string | null;
=======

// Definisikan tipe untuk data user (opsional tapi bagus)
interface UserState {
  access_token: string | null;
  role: string | null;
  id: number | null;
>>>>>>> origin/tya
  remember: boolean;
}

export const useAuthStore = defineStore('auth', {
<<<<<<< HEAD
  state: (): UserState => ({
    access_token: null,
    remember: false
  }),

  getters: {
    isAuthenticated: (state) => !!(state.access_token ?? localStorage.getItem("access_token")),
    authHeader: (state) => {
      const token = state.access_token ?? localStorage.getItem("access_token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  },

  actions: {
    async login(email: string, password: string, remember: boolean = false) {
      try {
        const response = await authApi.post(
          '/login',
          { email, password },
          { withCredentials: true }
        );

        const accessToken = response.data.access_token;

        if (!accessToken) {
          throw new Error("Access token tidak ditemukan dalam response");
        }

        this.setAuthData(accessToken, remember);

      } catch (error: any) {
        const message = "Email atau password salah";
        throw new Error(message);
      }
    },

    async refresh() {
      try {
        const res = await authApi.post('/refresh', {}, { withCredentials: true });
        this.setAuthData(res.data.access_token, this.remember);
      } catch (error) {
        this.clearAuthData();
        throw new Error('Unauthorized');
      }
    },

    getPayload(): MyJwtPayload {
      const access_token = this.access_token ?? localStorage.getItem("access_token");
      if (!access_token) {
        throw new Error("Access token tidak ditemukan");
      }
      const payload = jwtDecode<MyJwtPayload>(access_token);
      return {
        sub: payload.sub,
        role: payload.role,
        email: payload.email
      }
    },

    setAuthData(token: string, remember: boolean) {
      this.access_token = token;
      this.remember = remember;
      if (remember) {
        localStorage.setItem("access_token", token);
      }
    },

    clearAuthData() {
      localStorage.removeItem("access_token");
      this.access_token = null;
    },
    logout() {
      this.clearAuthData();
    }
=======
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
>>>>>>> origin/tya
  },
});