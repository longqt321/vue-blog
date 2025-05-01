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
    hidePost(id) {
      if (!this.hiddenPosts.includes(id)) {
        this.hiddenPosts.push(id);
      }
    },
    showPost(id) {
      this.hiddenPosts = this.hiddenPosts.filter((postId) => postId !== id);
    },
    async fetchPosts() {
      this.isLoading = true;
      try {
        const data = await blogService.getPosts();
        this.posts = data.map((post) => ({
          id: post.id,
          author: post.author,
          title: post.title,
          content: post.body,
          hashtags: post.hashtags,
          createdAt: post.createdAt,
        }));
      } catch (error) {
        console.error("ERROR FECTH POSTS!!", error);
      } finally {
        this.isLoading = false;
      }
    },
    // async deletePost(id) {
    //   try {
    //     await blogService.deletePost(id);
    //     this.posts = this.posts.filter((post) => post.id !== id);
    //   } catch (error) {
    //     console.error("ERROR DELETE POST!!", error);
    //   }
    // },
  },
  getters: {
    getPostById(state) {
      return (id) => {
        const post = state.posts.find((post) => post.id === id);
        if (!post) return null;
        return {
          ...post,
          createdAt: formatTime(post.createdAt),
          author: normalizeUser(post.author),
        };
      };
    },
    getPosts(state) {
      return state.posts
        .filter((post) => !state.hiddenPosts.includes(post.id))
        .map((post) => this.getPostById(post.id));
    },

    isModalOpen: (state) => state.isOpen,
  },
});
