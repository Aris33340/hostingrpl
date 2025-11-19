import axios from "axios";

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`
});

export default authApi;