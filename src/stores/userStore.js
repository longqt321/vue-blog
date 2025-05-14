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
    personalBlogs: [],
    savedBlogs: [],
    isLoadingProfile: false,
    isLoadingPersonalBlogs: false,
    isLoadingSavedBlogs: false,
    profileError: null,
    personalBlogsError: null,
    savedBlogsError: null,
  }),

  actions: {
    async fetchProfile(id) {
      this.isLoadingProfile = true;
      this.profileError = null;

      try {
        const data = await userService.getUserById(id);
        console.log(data);
        this.profile = {
          id: data.id,
          fullName: `${data.firstName} ${data.lastName}`,
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
        this.profileError = "Failed to load profile.";
      } finally {
        this.isLoadingProfile = false;
      }
    },

    async fetchPersonalBlogs() {
      this.isLoadingPersonalBlogs = true;
      this.personalBlogsError = null;
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
          this.personalBlogsError = response.message || "Failed to load blogs.";
          return;
        }

        this.personalBlogs = response.data.content;
      } catch (error) {
        console.error("ERROR FETCHING PERSONAL BLOGS", error);
        this.personalBlogsError = "Failed to load personal blogs.";
        throw error;
      } finally {
        this.isLoadingPersonalBlogs = false;
      }
    },
    async fetchSavedBlogs() {
      this.isLoadingSavedBlogs = true;
      this.savedBlogsError = null;
      try {
        const response = await blogService.getPosts({
          userId: this.profile.id,
          relationshipType: "SAVED",
        });
        if (!response.success) {
          this.savedBlogsError = response.message || "Failed to load blogs.";
          return;
        }

        this.savedBlogs = response.data.content;
      } catch (error) {
        console.error(error);
      }
    },
    removePostById(postId) {
      this.personalBlogs = this.personalBlogs.filter((p) => p.id !== postId);
      this.savedBlogs = this.savedBlogs.filter((p) => p.id !== postId);
      this.profile.postCount = this.profile.postCount - 1;
    },
    syncChanges(postId, postData) {
      const personalIndex = this.personalBlogs.findIndex(
        (post) => post.id === postId
      );
      if (personalIndex !== -1) {
        this.personalBlogs[personalIndex] = postData;
      }
    },
  },

  getters: {
    getProfile: (state) => state.profile,
    getPersonalBlogs: (state) => state.personalBlogs,
    isProfileLoading: (state) => state.isLoadingProfile,
    isBlogsLoading: (state) => state.isLoadingPersonalBlogs,
    getProfileError: (state) => state.profileError,
    getPersonalBlogsError: (state) => state.personalBlogsError,
    getSavedBlogs: (state) => state.savedBlogs,
  },
});
