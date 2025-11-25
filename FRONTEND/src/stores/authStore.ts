// src/stores/authStore.ts

import { defineStore } from 'pinia';
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
  remember: boolean;
}

export const useAuthStore = defineStore('auth', {
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
  },
});