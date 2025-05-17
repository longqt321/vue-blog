// ✅ Refactor userStore — chỉ lưu thông tin người dùng hiện tại đang đăng nhập
// ✅ Phù hợp với UI: avatar, tên, username, bio, ngày tạo, follower/following count, blogs

import { defineStore } from "pinia";
import userService from "@/services/userService";
import blogService from "@/services/blogService";
import defaultAvatar from "@/assets/avatar.jpg";
import { useAuthStore } from "./authStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: {
      id: null,
      fullName: "",
      username: "",
      avatar: defaultAvatar,
      bio: "",
      createdAt: null,
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
    },
    data: {
      personalBlogs: [],
      savedBlogs: [],
      suggestedUsers: [],
    },
    loading: {
      loading: false,
      personalBlogs: false,
      savedBlogs: false,
      suggestedUsers: false,
    },
    error: {
      suggestedUsers: null,
      profile: null,
      personalBlogs: null,
      savedBlogs: null,
    },
  }),

  actions: {
    async fetchProfile(id) {
      this.loading.profile = true;
      this.error.profile = null;

      try {
        const data = await userService.getUserById(id);
        console.log(data);
        this.profile = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: `${data.lastName} ${data.firstName}`,
          username: data.username,
          avatar: data.avatar || defaultAvatar,
          description: data.description || "",
          createdAt: data.createdAt,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          postCount: data.postCount || 0,
        };
      } catch (error) {
        console.error("ERROR FETCHING PROFILE", error);
        this.error.profile = "Failed to load profile.";
      } finally {
        this.loading.profile = false;
      }
    },

    async fetchPersonalBlogs() {
      this.loading.personalBlogs = true;
      this.error.personalBlogs = null;
      const authStore = useAuthStore();

      try {
        let response = {};
        if (authStore.user.id !== this.profile.id) {
          response = await blogService.getPosts({
            authorId: this.profile.id,
            visibility: "PUBLIC",
          });
        } else {
          response = await blogService.getPosts({
            authorId: this.profile.id,
          });
        }

        if (!response.success) {
          this.error.personalBlogs =
            response.message || "Failed to load blogs.";
          return;
        }

        this.data.personalBlogs = response.data.content;
      } catch (error) {
        console.error("ERROR FETCHING PERSONAL BLOGS", error);
        this.personalBlogsError = "Failed to load personal blogs.";
        throw error;
      } finally {
        this.loading.personalBlogs = false;
      }
    },
    async fetchSavedBlogs() {
      this.loading.savedBlogs = true;
      this.error.savedBlogs = null;
      try {
        const response = await blogService.getPosts({
          userId: this.profile.id,
          relationshipType: "SAVED",
        });
        if (!response.success) {
          this.error.savedBlogs = response.message || "Failed to load blogs.";
          return;
        }

        this.data.savedBlogs = response.data.content;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading.savedBlogs = false;
      }
    },
    async fetchSuggestedUsers() {
      this.loading.suggestedUsers = true;
      this.error.suggestedUsers = null;
      try {
        const response = await userService.getUsers();
        if (!response.success) {
          this.suggestedUsersError =
            response.message || "Failed to load suggested users";
          return;
        }
        this.data.suggestedUsers = response.data.content;
      } catch (error) {
        this.error.suggestedUsers = response.message;
        console.error(error);
      }
    },
    removePersonalPostById(postId) {
      this.data.personalBlogs = this.data.personalBlogs.filter(
        (p) => p.id !== postId
      );
      this.data.savedBlogs = this.data.savedBlogs.filter(
        (p) => p.id !== postId
      );
      this.profile.postCount = this.data.personalBlogs.length;
    },
    removeSavedPostById(postId) {
      this.data.savedBlogs = this.data.savedBlogs.filter(
        (p) => p.id !== postId
      );
    },
    syncChanges(postId, postData) {
      const personalIndex = this.data.personalBlogs.findIndex(
        (post) => post.id === postId
      );
      if (personalIndex !== -1) {
        this.data.personalBlogs[personalIndex] = postData;
      }
    },
  },

  getters: {
    getProfile: (state) => state.profile,
    getPersonalBlogs: (state) => state.data.personalBlogs,
    getSavedBlogs: (state) => state.data.savedBlogs,
    getSuggestedUsers: (state) => state.data.suggestedUsers,
    isProfileLoading: (state) => state.loading.profile,
    isPersonalBlogsLoading: (state) => state.loading.personalBlogs,
    isSavedBlogsLoading: (state) => state.loading.savedBlogs,
    isSuggestedUsersLoading: (state) => state.loading.suggestedUsers,
    getProfileError: (state) => state.error.profile,
    getPersonalBlogsError: (state) => state.error.personalBlogs,
    getSavedBlogsError: (state) => state.error.savedBlogs,
    getSuggestedUsersError: (state) => state.error.suggestedUsers,
  },
});
