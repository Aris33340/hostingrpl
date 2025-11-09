import axios from "axios";

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`, // base endpoint untuk auth
});

export default authApi;
