<template>
  <div class="login">
    <h2>Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
    <p style="color:red">{{ error }}</p>
    <p>token : {{ token }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '../router'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const token = ref('')

async function login() {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    localStorage.setItem('token', response.data.token)
    token.value = localStorage.getItem('token')
    router.push('/manajemen-mahasiswa')
  } catch (err) {
    error.value = err
  }
}
</script>