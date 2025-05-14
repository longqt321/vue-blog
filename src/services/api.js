import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";
import qs from "qs";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "repeat", // Chuyển mảng thành nhiều tham số cùng tên
      encode: false, // Không mã hóa để giữ nguyên giá trị
    }),
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    console.log(authStore.accessToken);
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 403) {
      console.error(
        "Access denied: Invalid or expired token.",
        error.response.data
      );
      authStore.logout();
      router.push("/login");
    } else if (error.response && error.response.status === 401) {
      console.error(
        "Unauthorized: Token might be missing or invalid.",
        error.response.data
      );
    } else {
      console.error("An unexpected error occurred.", error);
    }
    return Promise.reject(error);
  }
);

export default api;
