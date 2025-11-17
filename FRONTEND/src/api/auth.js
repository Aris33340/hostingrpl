import axios from "axios";

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`, withCredentials:true// base endpoint untuk auth
});

export default authApi;
