import { defineStore } from "pinia";
import authService from "@/services/authService";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || null),
    accessToken: localStorage.getItem("access_token") || null,
    isAuthenticated: !!localStorage.getItem("access_token"),
    skipAuth: false, // Thêm cờ để bỏ qua xác thực
  }),

  actions: {
    setAuth(data) {
      this.accessToken = data.token;
      this.user = data.user;
      this.isAuthenticated = true;
      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    logout() {
      this.accessToken = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },

    // Phương thức để bật chế độ bỏ qua xác thực
    enableSkipAuth() {
      this.skipAuth = true;
      console.log("Authentication check disabled temporarily");
    },

    // Phương thức để tắt chế độ bỏ qua xác thực
    disableSkipAuth() {
      this.skipAuth = false;
      console.log("Authentication check enabled");
    },
  },

  getters: {
    // Getter để kiểm tra xem có nên bỏ qua xác thực hay không
    shouldSkipAuth: (state) => state.skipAuth || state.isAuthenticated,
    getUser: (state) => state.user,
  },
});
