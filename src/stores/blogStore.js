import { defineStore } from "pinia";
import blogService from "@/services/blogService";

export const useBlogStore = defineStore("blog", {
  state: () => ({
    isOpen: false,
    isLoading: false,
    posts: [], // Single source of posts for both main feed and profiles
    currentView: "main", // 'main' or 'profile'
    currentProfileId: null, // Track which user's profile we're viewing
    hiddenPosts: [],
    isEditMode: false,
    currentPost: null,
    error: null,
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
    // Fetch posts for main feed
    async fetchMainPosts() {
      this.isLoading = true;
      this.error = null;
      this.currentView = "main";
      this.currentProfileId = null;

      try {
        const response = await blogService.getPosts();
        this.posts = response;
        return response;
      } catch (error) {
        console.error("ERROR FETCH POSTS", error);
        this.error = "Failed to load posts. Please try again later.";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    // Fetch posts for user profile
    async fetchProfilePosts(userId) {
      this.isLoading = true;
      this.error = null;
      this.currentView = "profile";
      this.currentProfileId = userId;

      try {
        const response = await blogService.getPostsByUserId(userId);
        this.posts = response;
        return response;
      } catch (error) {
        console.error(`ERROR FETCH USER POSTS for user ${userId}`, error);
        this.error = "Failed to load user posts. Please try again later.";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async createPost(postData) {
      this.error = null;
      try {
        const response = await blogService.createPost(postData);

        // Add the new post to the beginning of the posts array
        // Only if we're in main view or viewing the author's profile
        if (
          this.currentView === "main" ||
          (this.currentView === "profile" &&
            this.currentProfileId === postData.author.id)
        ) {
          this.posts.unshift(response);
        }

        return response;
      } catch (error) {
        console.error("ERROR CREATE POST", error);
        this.error = "Failed to create post. Please try again.";
        throw error;
      }
    },
    async updatePost(postId, updatedPost) {
      this.error = null;
      try {
        const response = await blogService.updatePost(postId, updatedPost);

        // Update post in posts array
        const postIndex = this.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          this.posts[postIndex] = response;
        }

        return response;
      } catch (error) {
        console.error("ERROR UPDATE POST", error);
        this.error = "Failed to update post. Please try again.";
        throw error;
      }
    },
    async deletePost(postId) {
      this.error = null;
      try {
        await blogService.deletePost(postId);

        // Remove from posts array
        this.posts = this.posts.filter((post) => post.id !== postId);
      } catch (error) {
        console.error("ERROR DELETE POST", error);
        this.error = "Failed to delete post. Please try again.";
        throw error;
      }
    },
    async likePost(postId) {
      this.error = null;
      try {
        await blogService.likePost(postId);

        // Update liked status in posts array
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.liked = true;
        }
      } catch (error) {
        console.error("ERROR LIKE POST", error);
        this.error = "Failed to like post. Please try again.";
        throw error;
      }
    },
    async unlikePost(postId) {
      this.error = null;
      try {
        await blogService.unlikePost(postId);

        // Update liked status in posts array
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.liked = false;
        }
      } catch (error) {
        console.error("ERROR UNLIKE POST", error);
        this.error = "Failed to unlike post. Please try again.";
        throw error;
      }
    },
  },
  getters: {
    isModalOpen: (state) => state.isOpen,
    isInEditMode: (state) => state.isEditMode,
    getPostBeingEdited: (state) => state.currentPost,
    getPosts: (state) => state.posts,
    getPostById: (state) => (id) => state.posts.find((post) => post.id === id),
    isPostsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    isProfileView: (state) => state.currentView === "profile",
    getCurrentProfileId: (state) => state.currentProfileId,
  },
});
