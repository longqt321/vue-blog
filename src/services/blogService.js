import api from "./api";

export default {
  async getPosts(filter = {}, page = 0, size = 10) {
    try {
      const params = {
        ...filter,
        page,
        size,
      };
      const response = await api.get("/blogs", {
        params,
      });
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
      console.log(post);
      const response = await api.post(`/blogs`, post);
      return response.data;
    } catch (error) {
      console.error("ERROR CREATE POST!!", error);
      throw error;
    }
  },

  async likePost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("ERROR LIKE POST!!", error);
      throw error;
    }
  },

  async unlikePost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/unlike`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNLIKE POST!!", error);
      throw error;
    }
  },

  // Save a post
  async savePost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/save`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("ERROR SAVE POST", error);
      throw error;
    }
  },

  // Unsave a post
  async unsavePost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/unsave`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNSAVE POST", error);
      throw error;
    }
  },
  async reportPost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/report`);
      return response.data;
    } catch (error) {
      console.error("ERROR REPORT POST", error);
      throw error;
    }
  },

  // Unsave a post
  async unreportPost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/unreport`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNREPORT POST", error);
      throw error;
    }
  },

  async hidePost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/hide`);
      return response.data;
    } catch (error) {
      console.error("ERROR HIDE POST", error);
      throw error;
    }
  },
  async unhidePost(postId) {
    try {
      const response = await api.post(`/blogs/${postId}/unhide`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNHIDE POST", error);
      throw error;
    }
  },
};
