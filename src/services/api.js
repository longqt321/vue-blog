import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";
import qs from "qs";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "repeat",
      encode: false,
    }),
});

// =============== CONTROL FLAG & QUEUE ===============
let isRefreshing = false;
let failedQueue = [];

// =============== PROCESS QUEUED REQUESTS ===============
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// =============== REQUEST INTERCEPTOR ===============
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

// =============== RESPONSE INTERCEPTOR ===============
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("Refreshing");
        const response = await api.post("/auth/refresh", null);
        const newAccessToken = response.data.accessToken;

        authStore.accessToken = newAccessToken;
        processQueue(null, authStore.accessToken);

        originalRequest.headers.Authorization =
          "Bearer " + authStore.accessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authStore.logout();
        router.push("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
