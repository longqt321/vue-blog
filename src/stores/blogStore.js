import { defineStore } from "pinia";
import { useUserStore } from "./userStore";
import blogService from "@/services/blogService";
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
          authorId: post.authorId,
          title: post.title,
          content: post.body,
          hashtags: post.tags,
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
    getPosts: (state) => {
      const userStore = useUserStore();
      return state.posts
        .filter((post) => !state.hiddenPosts.includes(post.id))
        .map((post) => {
          const author = userStore.getUserById(post.authorId);
          if (author === undefined) {
            return {
              ...post,
            };
          }
          return {
            ...post,
            author: {
              ...author,
              fullName: userStore.getUserFullName(author),
            },
          };
        });
    },
    searchBlogs: (state) => (query) => {
      if (!query || query.trim() === "") {
        const blogStore = useBlogStore();
        return blogStore.getPosts;
      }
      const userStore = useUserStore();
      const lowercaseQuery = query.toLowerCase().trim();
      return state.posts
        .filter((post) => !state.hiddenPosts.includes(post.id))
        .filter((post) => {
          const author = userStore.getUserById(post.authorId);
          const authorFullName = author
            ? userStore.getUserFullName(author)
            : "";
          if (lowercaseQuery.startsWith("#")) {
            console.log(1);
            const tag = lowercaseQuery.slice(1);
            return post.hashtags.some((hashtag) =>
              hashtag.toLowerCase().includes(tag)
            );
          } else {
            return (
              post.title.toLowerCase().includes(lowercaseQuery) ||
              authorFullName.toLowerCase().includes(lowercaseQuery)
            );
          }
        })
        .map((post) => {
          const author = userStore.getUserById(post.authorId);
          if (author === undefined) {
            return {
              ...post,
            };
          } else {
            return {
              ...post,
              author: {
                ...author,
                fullName: userStore.getUserFullName(author),
              },
            };
          }
        });
    },
    getPostById: (state) => (id) => {
      return state.posts.find((post) => post.id === id);
    },

    isModalOpen: (state) => state.isOpen,
  },
});
