<template>
  <div class="login-page">
    
    <div class="content-wrapper form-wrapper">
      
      <div class="form-content-card"> 
        
        <div class="logo-container">
          <img src="@/assets/images/LogoLogin2.png" alt="STISGrad Logo" class="logo" />
        </div>
        
        <h1>Selamat Datang!</h1>
        <p class="subtitle">Silakan masukkan username dan password sesuai divisi Anda.</p>
        
        <form @submit.prevent="handleLogin">
          
          <div class="form-group">
            <label for="username">Username</label> 
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              placeholder="Masukkan username Anda"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              placeholder="Masukkan password Anda"
              required
            />
          </div>
          
          <div class="form-options">
            <input type="checkbox" id="remember-me" v-model="form.remember" />
            <label for="remember-me">Ingat saya</label>
          </div>
          
          <button type="submit" class="login-button">Log In</button>

          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>
    
    <div class="content-wrapper branding-wrapper">
      <div class="branding-content">
        <h2>Permudah manajemen kegiatan wisuda dalam satu tempat.</h2>
        <p>Log In untuk menciptakan wisuda yang tak terlupakan.</p>
        <img 
          src="@/assets/images/app-cluster.png" 
          alt="App Mockup Cluster" 
          class="mockup-image" 
        />
      </div>
    </div>
    
  </div>
</template>

<script>
// --- MODIFIKASI UNTUK PINIA & INTERCEPTOR ---

// 1. Impor 'mapActions' dari Pinia dan store kita
import { mapActions } from 'pinia';
import { useAuthStore } from '../stores/authStore';

// 2. Impor 'apiClient' baru kita, BUKAN 'axios' biasa
import apiClient from '../plugins/axios';

// Menggunakan VUE 2 (Options API)
export default {
  data() {
    return {
      form: {
        username: '', 
        password: '',
        remember: false
      },
      error: '',
    };
  },
  methods: {
    // 3. Petakan 'action' dari store kita ke komponen ini
    ...mapActions(useAuthStore, ['setAuthData']),

    async handleLogin() {
      this.error = ''; 
      
      try {
        // 4. Gunakan 'apiClient' baru kita
        const response = await apiClient.post('/auth/login', {
          // Di backend, kita login pakai 'email', tapi form pakai 'username'
          // Kita kirim 'username' dari form sebagai 'email' ke backend
          email: this.form.username, 
          password: this.form.password
        });
        
        // 5. Backend HANYA mengirim 'access_token' dan 'role'
        const accessToken = response.data.access_token;
        const userRole = response.data.role;

        // 6. Panggil action Pinia untuk menyimpan data di memori
        // BUKAN localStorage
        this.setAuthData(accessToken, userRole);
        
        // 7. Arahkan ke halaman utama setelah login
        this.$router.push('/input-excel'); 

      } catch (err) {
        // Interceptor akan menangani error 401 (token refresh)
        // Ini hanya akan menangani error login (misal: password salah)
        if (err.response && err.response.data && err.response.data.message) {
          this.error = err.response.data.message;
        } else {
          this.error = 'Login gagal. Periksa kembali username dan password Anda.';
        }
        console.error('Login error:', err);
      }
    }
  }
};
</script>

<style scoped>
/* Impor font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Struktur Utama */
.login-page {
  /* PERBAIKAN: Menggunakan 'position: fixed' 
    Ini akan membuat halaman login "keluar" dari container 
    di App.vue dan menutupi seluruh layar.
  */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000; /* Memastikan ini paling atas */
  
  /* Sisa style lama Anda */
  display: flex;
  flex-wrap: wrap; 
  overflow: auto; 
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  background-image: url('@/assets/images/Background.png');
  background-size: cover;
  background-position: center;
  
  padding: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: 2rem; 
}

.content-wrapper {
  flex: 1; 
  min-width: 320px; 
}

.form-wrapper {
  display: grid;
  place-items: center; 
}

.form-content-card {
  width: 100%;
  max-width: 450px; 
  background: #ffffff;
  padding: 2.5rem; 
  border-radius: 16px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
  box-sizing: border-box;
}

.logo-container {
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center; /* Logo di tengah */
}
.logo {
  max-width: 250px; 
  display: block;
}

/* Styling Teks Form */
h1 {
  font-size: 2rem; 
  font-weight: 700;
  color: #111827; 
}
.subtitle {
  font-size: 0.95rem; 
  color: #6B7280; 
  margin-top: 0.5rem;
  margin-bottom: 2.5rem; 
}

/* Styling Input (Putih) */
.form-group {
  margin-bottom: 1.25rem; 
}
.form-group label {
  display: block;
  font-weight: 500;
  font-size: 0.875rem; 
  color: #374151; 
  margin-bottom: 0.5rem; 
}
.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.875rem 1rem; 
  border: 1px solid #D1D5DB; 
  background: #FFFFFF; 
  color: #111827; 
  border-radius: 8px; 
  box-sizing: border-box; 
  font-size: 0.9rem;
}
.form-group input[type="text"]:focus,
.form-group input[type="password"]:focus {
  outline: none;
  border-color: #06B6D4; 
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
}

.form-options {
  display: flex;
  align-items: center;
  margin-bottom: 2rem; 
  font-size: 0.875rem; 
  color: #374151;
}
.form-options input[type="checkbox"] {
  margin-right: 0.5rem; 
  width: 16px;
  height: 16px;
  accent-color: #06B6D4;
}

.login-button {
  width: 100%;
  padding: 0.875rem; 
  background-color: #06B6D4; 
  color: white;
  border: none;
  border-radius: 8px; 
  font-weight: 600;
  font-size: 1rem; 
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.login-button:hover {
  background-color: #0891B2; 
}

.branding-content {
  color: white;
  padding: 2rem;
  text-align: left; 
}
.branding-content h2 {
  font-size: 2.25rem; 
  font-weight: 700;
  line-height: 1.3;
  max-width: 500px; 
}
.branding-content p {
  font-size: 1.125rem; 
  margin-top: 1rem; 
  max-width: 500px;
  opacity: 0.9;
}

.mockup-image {
  width: 100%;
  max-width: 550px; 
  margin-top: 2.5rem; 
  border-radius: 8px; 
}

.error-message {
  color: #EF4444; 
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1.25rem; 
}
</style>