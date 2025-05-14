// 📌 Đây là phiên bản đã refactor theo best practice
// ❌ Các phần bị vi phạm phân tách trách nhiệm (UI logic: isOpen, isEditMode, currentPost)
//    → Đã được loại bỏ và nên đưa vào composable usePostModal()

import { defineStore } from "pinia";
import blogService from "@/services/blogService";
import { trim } from "lodash";

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
    searchQuery: "",
  }),

  actions: {
    parseSearchQuery() {
      const filter = {
        title: "",
        hashtags: [],
        username: "",
        author: "",
      };
      if (!this.searchQuery) return filter;
      const tokens = this.searchQuery.split(",");
      for (const token of tokens) {
        const trimmed = token.trim();
        if (trimmed.startsWith("#")) {
          filter.hashtags.push(trimmed.substring(1));
        } else if (trimmed.startsWith("@")) {
          filter.username = trimmed.substring(1);
        } else if (trimmed.startsWith("!")) {
          filter.author = trimmed.substring(1);
        } else {
          filter.title = trimmed;
        }
      }
      return filter;
    },

    async fetchPublicPosts(page = 0) {
      this.isLoading = true;
      this.error = null;
      try {
        const filter = {
          ...this.parseSearchQuery(),
          visibility: "PUBLIC",
        };
        const response = await blogService.getPosts({
          ...filter,
          page,
          size: this.pageSize,
          sortBy: this.sortBy,
        });
        console.log(filter);

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
      console.log("LOAD MORE!!");
      if (!this.hasMorePosts || this.isLoading) return Promise.resolve();

      return await this.fetchPublicPosts(this.currentPage + 1);
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

    removePostById(postId) {
      this.publicPosts = this.publicPosts.filter((p) => p.id !== postId);
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
