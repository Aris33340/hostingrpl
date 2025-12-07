import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const emailApi = axios.create({
  baseURL: `${API_BASE_URL}/email`,
  withCredentials: true,
});

export default emailApi;
