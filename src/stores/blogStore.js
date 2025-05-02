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
    isEditMode: false,
    currentPost: null
  }),
  actions: {
    openModal() {
      this.isOpen = true;
      this.isEditMode = false;
      this.currentPost = null;
    },
    closeModal() {
      this.isOpen = false;
      this.isEditMode = false;
      this.currentPost = null;
    },
    openEditModal(post) {
      this.currentPost = post;
      this.isEditMode = true;
      this.isOpen = true;
    },
    async updatePost(postId, updatedPost) {
      try {
        const response = await blogService.updatePost(postId, updatedPost);
        // Update the post in the local posts array
        const index = this.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
          this.posts[index] = response;
        }
        return response;
      } catch (error) {
        console.error("ERROR UPDATE POST", error);
        throw error;
      }
    }
  },
  getters: {
    isModalOpen: (state) => state.isOpen,
    isInEditMode: (state) => state.isEditMode,
    getPostBeingEdited: (state) => state.currentPost
  }
});
