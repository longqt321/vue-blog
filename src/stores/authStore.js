import { defineStore } from "pinia";
import authService from "@/services/authService";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("access_token") || null,
    isAuthenticated: !!localStorage.getItem("access_token"),
  }),

  actions: {
    setAuth(data) {
      this.accessToken = data.accessToken;
      this.isAuthenticated = true;
      localStorage.setItem("access_token", this.accessToken);
    },

    logout() {
      this.accessToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem("access_token");
    },
  },
});
