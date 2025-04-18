import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 403) {
      authStore.logout();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
