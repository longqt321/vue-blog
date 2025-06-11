import { defineStore } from "pinia";
import userService from "@/services/userService";
import blogService from "@/services/blogService";
import { useAuthStore } from "./authStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: {
      id: null,
      fullName: "",
      username: "",
      avatar: null,
      description: "",
      createdAt: null,
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
    },
    data: {
      personalBlogs: [],
      savedBlogs: [],
      hiddenBlogs: [],
      suggestedUsers: [],
      searchQuery: "",
    },
    currentPage: {
      suggestedUsers: 0,
      personalBlogs: 0,
      savedBlogs: 0,
      hiddenBlogs: 0,
    },
    moreDataAvailable: {
      suggestedUsers: false,
      personalBlogs: false,
      savedBlogs: false,
      hiddenBlogs: false,
    },
    loading: {
      personalBlogs: false,
      savedBlogs: false,
      hiddenBlogs: false,
      profile: false,
      suggestedUsers: false,
    },
    error: {
      suggestedUsers: null,
      profile: null,
      personalBlogs: null,
      savedBlogs: null,
      hiddenBlogs: null,
    },
  }),

  actions: {
    reset() {
      this.profile = {
        id: null,
        fullName: "",
        username: "",
        avatar: null,
        description: "",
        createdAt: null,
        followersCount: 0,
        followingCount: 0,
        postCount: 0,
      };
      this.data.personalBlogs = [];
      this.data.savedBlogs = [];
      this.data.hiddenBlogs = [];
      this.data.suggestedUsers = [];
      this.data.searchQuery = "";
      this.currentPage.suggestedUsers = 0;
      this.currentPage.personalBlogs = 0;
      this.currentPage.savedBlogs = 0;
      this.currentPage.hiddenBlogs = 0;
      this.moreDataAvailable.suggestedUsers = false;
      this.moreDataAvailable.personalBlogs = false;
      this.moreDataAvailable.savedBlogs = false;
      this.moreDataAvailable.hiddenBlogs = false;
      this.loading = {
        loading: false,
        personalBlogs: false,
        savedBlogs: false,
        suggestedUsers: false,
      };
      this.error = {
        suggestedUsers: null,
        profile: null,
        personalBlogs: null,
        savedBlogs: null,
      };
    },
    parseSearchQuery() {
      const filter = {
        username: "",
        fullName: "",
      };
      const addToFilter = (token) => {
        const trimmed = token.trim();
        if (!trimmed) return;
        if (trimmed.startsWith("@")) {
          filter.username = trimmed.substring(1);
        } else {
          filter.fullName = trimmed;
        }
      };
      console.log("SEARCH QUERY", this.data.searchQuery);
      if (!this.data.searchQuery) return filter;
      const tokens = this.data.searchQuery.split(",");
      for (const token of tokens) {
        addToFilter(token);
      }
      console.log("FILTER", filter);
      return filter;
    },
    async fetchProfile(id) {
      this.loading.profile = true;
      this.error.profile = null;

      try {
        const data = await userService.getUserById(id);

        //console.log(data);
        this.profile = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: `${data.lastName} ${data.firstName}`,
          username: data.username,
          avatar: data.avatarId,
          description: data.description || "",
          createdAt: data.createdAt,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          postCount: data.postCount || 0,
        };
        //console.log("PROFILE DATA", this.profile.avatar);
      } catch (error) {
        console.error("ERROR FETCHING PROFILE", error);
        this.error.profile = "Failed to load profile.";
      } finally {
        this.loading.profile = false;
      }
    },
    setProfile(profile) {
      this.profile = {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        fullName: `${profile.lastName} ${profile.firstName}`,
        username: profile.username,
        avatar: profile.avatarId,
        description: profile.description || "",
        createdAt: profile.createdAt,
        followersCount: profile.followersCount || 0,
        followingCount: profile.followingCount || 0,
        postCount: profile.postCount || 0,
      };
    },
    async fetchPersonalBlogs(page = 0, append = false) {
      this.loading.personalBlogs = true;
      this.error.personalBlogs = null;
      const authStore = useAuthStore();

      try {
        let response = {};
        if (authStore.user.id !== this.profile.id) {
          response = await blogService.getPosts(
            {
              authorId: this.profile.id,
              visibility: "PUBLIC",
            },
            page
          );
        } else {
          response = await blogService.getPosts(
            {
              authorId: this.profile.id,
            },
            page
          );
        }

        if (!response.success) {
          this.error.personalBlogs =
            response.message || "Failed to load blogs.";
          return;
        }

        const pageData = response.data;

        // If page is 0 or append is false, replace the array, otherwise append the new content
        if (page === 0 || !append) {
          this.data.personalBlogs = pageData.content;
        } else {
          this.data.personalBlogs.push(...pageData.content);
        }

        this.moreDataAvailable.personalBlogs = !pageData.last;
        this.currentPage.personalBlogs = page;

        console.log("PersonalBlogs pagination:", {
          page,
          append,
          contentLength: pageData.content.length,
          totalBlogs: this.data.personalBlogs.length,
          hasMore: this.moreDataAvailable.personalBlogs,
        });
      } catch (error) {
        console.error("ERROR FETCHING PERSONAL BLOGS", error);
        this.error.personalBlogs = "Failed to load personal blogs.";
        throw error;
      } finally {
        this.loading.personalBlogs = false;
      }
    },
    async fetchSavedBlogs(page = 0, append = false) {
      this.loading.savedBlogs = true;
      this.error.savedBlogs = null;
      try {
        const response = await blogService.getPosts(
          {
            userId: this.profile.id,
            relationshipType: "SAVED",
          },
          page
        );
        if (!response.success) {
          this.error.savedBlogs = response.message || "Failed to load blogs.";
          return;
        }

        const pageData = response.data;

        // If page is 0 or append is false, replace the array, otherwise append the new content
        if (page === 0 || !append) {
          this.data.savedBlogs = pageData.content;
        } else {
          this.data.savedBlogs.push(...pageData.content);
        }

        this.moreDataAvailable.savedBlogs = !pageData.last;
        this.currentPage.savedBlogs = page;

        console.log("SavedBlogs pagination:", {
          page,
          append,
          contentLength: pageData.content.length,
          totalBlogs: this.data.savedBlogs.length,
          hasMore: this.moreDataAvailable.savedBlogs,
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading.savedBlogs = false;
      }
    },
    async fetchHiddenBlogs(page = 0, append = false) {
      this.loading.hiddenBlogs = true;
      this.error.hiddenBlogs = null;
      try {
        const response = await blogService.getPosts(
          {
            userId: this.profile.id,
            relationshipType: "HIDDEN",
          },
          page
        );
        if (!response.success) {
          this.error.hiddenBlogs =
            response.message || "Failed to load hidden blogs.";
          return;
        }

        const pageData = response.data;

        // If page is 0 or append is false, replace the array, otherwise append the new content
        if (page === 0 || !append) {
          this.data.hiddenBlogs = pageData.content;
        } else {
          this.data.hiddenBlogs.push(...pageData.content);
        }

        this.moreDataAvailable.hiddenBlogs = !pageData.last;
        this.currentPage.hiddenBlogs = page;

        console.log("HiddenBlogs pagination:", {
          page,
          append,
          contentLength: pageData.content.length,
          totalBlogs: this.data.hiddenBlogs.length,
          hasMore: this.moreDataAvailable.hiddenBlogs,
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading.hiddenBlogs = false;
      }
    },
    async fetchSuggestedUsers(page = 0) {
      this.loading.suggestedUsers = true;
      this.error.suggestedUsers = null;
      try {
        const filter = {
          ...this.parseSearchQuery(),
        };
        console.log("FILTER", filter);
        const response = await userService.getUsers(filter, page);
        if (!response.success) {
          this.error.suggestedUsers =
            response.message || "Failed to load suggested users";
          return;
        }
        const pageData = response.data;

        // If page is 0, replace the array, otherwise append the new content
        if (page === 0) {
          this.data.suggestedUsers = pageData.content;
        } else {
          this.data.suggestedUsers.push(...pageData.content);
        }
        console.log(pageData.last);
        this.moreDataAvailable.suggestedUsers = !pageData.last;
        this.currentPage.suggestedUsers = page;
      } catch (error) {
        this.error.suggestedUsers = error.message || "An error occurred";
        console.error(error);
      } finally {
        this.loading.suggestedUsers = false;
      }
    },
    async loadMoreSuggestedUsers() {
      if (
        !this.moreDataAvailable.suggestedUsers ||
        this.loading.suggestedUsers
      ) {
        return Promise.resolve();
      }
      return await this.fetchSuggestedUsers(
        this.currentPage.suggestedUsers + 1
      );
    },
    async loadMorePersonalBlogs() {
      if (!this.moreDataAvailable.personalBlogs || this.loading.personalBlogs) {
        return Promise.resolve();
      }
      return await this.fetchPersonalBlogs(
        this.currentPage.personalBlogs + 1,
        true
      );
    },
    async loadMoreSavedBlogs() {
      if (!this.moreDataAvailable.savedBlogs || this.loading.savedBlogs) {
        return Promise.resolve();
      }
      return await this.fetchSavedBlogs(this.currentPage.savedBlogs + 1, true);
    },
    async loadMoreHiddenBlogs() {
      if (!this.moreDataAvailable.hiddenBlogs || this.loading.hiddenBlogs) {
        return Promise.resolve();
      }
      return await this.fetchHiddenBlogs(
        this.currentPage.hiddenBlogs + 1,
        true
      );
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
    removeHiddenPostById(postId) {
      this.data.hiddenBlogs = this.data.hiddenBlogs.filter(
        (p) => p.id !== postId
      );
    },
    syncChanges(postId, postData) {
      // Update personal blogs
      const personalIndex = this.data.personalBlogs.findIndex(
        (post) => post.id === postId
      );
      if (personalIndex !== -1) {
        this.data.personalBlogs[personalIndex] = postData;
      }

      // Update saved blogs
      const savedIndex = this.data.savedBlogs.findIndex(
        (post) => post.id === postId
      );
      if (savedIndex !== -1) {
        this.data.savedBlogs[savedIndex] = postData;
      }

      // Update hidden blogs
      const hiddenIndex = this.data.hiddenBlogs.findIndex(
        (post) => post.id === postId
      );
      if (hiddenIndex !== -1) {
        this.data.hiddenBlogs[hiddenIndex] = postData;
      }
    },
  },

  getters: {
    getProfile: (state) => state.profile,
    getPersonalBlogs: (state) => state.data.personalBlogs,
    getSavedBlogs: (state) => state.data.savedBlogs,
    getSuggestedUsers: (state) => state.data.suggestedUsers,
    getHiddenBlogs: (state) => state.data.hiddenBlogs,
    isProfileLoading: (state) => state.loading.profile,
    isPersonalBlogsLoading: (state) => state.loading.personalBlogs,
    isSavedBlogsLoading: (state) => state.loading.savedBlogs,
    isSuggestedUsersLoading: (state) => state.loading.suggestedUsers,
    isHiddenBlogsLoading: (state) => state.loading.hiddenBlogs,
    moreSuggestedUsersAvailable: (state) =>
      state.moreDataAvailable.suggestedUsers,
    morePersonalBlogsAvailable: (state) =>
      state.moreDataAvailable.personalBlogs,
    moreSavedBlogsAvailable: (state) => state.moreDataAvailable.savedBlogs,
    moreHiddenBlogsAvailable: (state) => state.moreDataAvailable.hiddenBlogs,
    getProfileError: (state) => state.error.profile,
    getPersonalBlogsError: (state) => state.error.personalBlogs,
    getSavedBlogsError: (state) => state.error.savedBlogs,
    getSuggestedUsersError: (state) => state.error.suggestedUsers,
    getHiddenBlogsError: (state) => state.error.hiddenBlogs,
    getSuggestedUsersCurrentPage: (state) => state.currentPage.suggestedUsers,
  },
});
