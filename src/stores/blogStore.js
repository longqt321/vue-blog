// 📌 Đây là phiên bản đã refactor theo best practice
// ❌ Các phần bị vi phạm phân tách trách nhiệm (UI logic: isOpen, isEditMode, currentPost)
//    → Đã được loại bỏ và nên đưa vào composable usePostModal()

import { defineStore } from "pinia";
import blogService from "@/services/blogService";

export const useBlogStore = defineStore("blog", {
  state: () => ({
    isLoading: false,
    publicPosts: [],
    hiddenPosts: [],
    error: null,
    currentPage: 0,
    pageSize: 10,
    sortBy: "createdAt,desc",
    hasMorePosts: true,
  }),

  actions: {
    async fetchPublicPosts(page = 0) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await blogService.getPosts({
          visibility: "PUBLIC",
          page,
          size: this.pageSize,
          sortBy: this.sortBy,
        });

        if (response.success === false) {
          this.error = response.message || "Unknown error occurred";
          return;
        }

        // Trích xuất dữ liệu từ response
        const pageData = response.data;

        this.publicPosts = pageData.content;
        this.hasMorePosts = !pageData.last;
        this.currentPage = page;
      } catch (error) {
        this.error = "Failed to load posts. Please try again later.";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async loadMorePublicPosts() {
      if (!this.hasMorePosts || this.isLoading) return;
      await this.fetchPublicPosts(this.currentPage + 1, false);
    },

    async createPost(postData) {
      this.error = null;
      try {
        const response = await blogService.createPost(postData);
        if (postData.status === "PUBLIC") {
          this.publicPosts.unshift(response);
        }
        return response;
      } catch (error) {
        this.error = "Failed to create post. Please try again.";
        throw error;
      }
    },

    async updatePost(postId, updatedPost) {
      this.error = null;
      try {
        const response = await blogService.updatePost(postId, updatedPost);
        const index = this.publicPosts.findIndex((p) => p.id === postId);
        if (updatedPost.status === "PUBLIC") {
          index !== -1
            ? (this.publicPosts[index] = response)
            : this.publicPosts.unshift(response);
        } else if (index !== -1) {
          this.publicPosts.splice(index, 1);
        }
        return response;
      } catch (error) {
        this.error = "Failed to update post. Please try again.";
        throw error;
      }
    },

    async deletePost(postId) {
      this.error = null;
      try {
        await blogService.deletePost(postId);
        this.publicPosts = this.publicPosts.filter((p) => p.id !== postId);
      } catch (error) {
        this.error = "Failed to delete post. Please try again.";
        throw error;
      }
    },

    async likePost(postId) {
      this.error = null;
      try {
        await blogService.likePost(postId);
        const post = this.publicPosts.find((p) => p.id === postId);
        if (post) post.liked = true;
      } catch (error) {
        this.error = "Failed to like post. Please try again.";
        throw error;
      }
    },

    async unlikePost(postId) {
      this.error = null;
      try {
        await blogService.unlikePost(postId);
        const post = this.publicPosts.find((p) => p.id === postId);
        if (post) post.liked = false;
      } catch (error) {
        this.error = "Failed to unlike post. Please try again.";
        throw error;
      }
    },
  },

  getters: {
    getPublicPosts: (state) => state.publicPosts,
    getPostById: (state) => (id) => state.publicPosts.find((p) => p.id === id),
    isPostsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    hasMore: (state) => state.hasMorePosts,
    getCurrentPage: (state) => state.currentPage,
  },
});
