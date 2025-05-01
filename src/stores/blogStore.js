import { defineStore } from "pinia";
import { useUserStore } from "./userStore";
import blogService from "@/services/blogService";
import { formatTime } from "@/composables/timeFormatter";
import { normalizeUser } from "@/composables/userFormater";

export const useBlogStore = defineStore("blog", {
  state: () => ({
    isOpen: false,
    isLoading: false,
    posts: [],
    hiddenPosts: [],
  }),
  actions: {
    openModal() {
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
    },
  },
  getters: {
    isModalOpen: (state) => state.isOpen,
  },
});
