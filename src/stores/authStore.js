import { defineStore } from "pinia";
import authService from "@/services/authService";
import router from "@/router";
import { normalizeUser } from "@/composables/userFormater";
import { useUserStore } from "./userStore";
import { useBlogStore } from "./blogStore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || null),
    accessToken: localStorage.getItem("access_token") || null,
    isAuthenticated: !!localStorage.getItem("access_token"),
    skipAuth: false,
  }),

  actions: {
    setAuth(data) {
      this.accessToken = data.accessToken;
      this.user = data.user;
      this.isAuthenticated = true;
      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    logout() {
      const userStore = useUserStore();
      const blogStore = useBlogStore();

      this.accessToken = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      userStore.reset();
      blogStore.reset();
    },

    enableSkipAuth() {
      this.skipAuth = true;
      console.log("Authentication check disabled temporarily");
    },

    disableSkipAuth() {
      this.skipAuth = false;
      console.log("Authentication check enabled");
    },
  },

  getters: {
    shouldSkipAuth: (state) => state.skipAuth || state.isAuthenticated,
    getUser: (state) => normalizeUser(state.user),
  },
});
