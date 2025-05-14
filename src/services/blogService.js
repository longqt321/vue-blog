import api from "./api";

export default {
  async getPosts(filter = {}, page = 0, size = 10, sortBy = "createdAt,desc") {
    try {
      const params = {
        ...filter,
        page,
        size,
        sortBy,
      };
      const response = await api.get("/blogs", {
        params,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH POSTS!!", error);
      throw error;
    }
  },


  async updatePost(id, newPostData) {
    try {
      const response = await api.put(`/blogs/${id}`, newPostData);
      return response.data;
    } catch (error) {
      console.error("ERROR UPDATE POST!!", error);
      throw error;
    }
  },

  async deletePost(id) {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR DELETE POST!!", error);
      throw error;
    }
  },

  async createPost(post) {
    try {
      const response = await api.post(`/blogs`, post);
      return response.data;
    } catch (error) {
      console.error("ERROR CREATE POST!!", error);
      throw error;
    }
  },

  async likePost(postId) {
    try {
      const response = await api.post(`/blogs/like/${postId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR LIKE POST!!", error);
      throw error;
    }
  },

  async unlikePost(postId) {
    try {
      const response = await api.post(`/blogs/unlike/${postId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNLIKE POST!!", error);
      throw error;
    }
  },

  // Get saved posts for the logged-in user
  async getSavedPosts(page = 0, size = 10, sortBy = "createdAt,desc") {
    try {
      const response = await api.get("/blogs/saved", {
        params: {
          page,
          size,
          sortBy,
        },
      });
      return response.data.content;
    } catch (error) {
      console.error("ERROR FETCH SAVED POSTS", error);
      throw error;
    }
  },

  // Save a post
  async savePost(postId) {
    try {
      const response = await api.post(`/blogs/save/${postId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR SAVE POST", error);
      throw error;
    }
  },

  // Unsave a post
  async unsavePost(postId) {
    try {
      const response = await api.post(`/blogs/unsave/${postId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNSAVE POST", error);
      throw error;
    }
  },
};
