import axios from 'axios'

const mainApi  = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
})

mainApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default mainApi