import api from "./api";

export default {
  async getPosts() {
    try {
      const response = await api.get("/blogs");
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH POSTS!!", error);
      throw error;
    }
  },
  async getPostById(id) {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH POST BY ID!!", error);
      throw error;
    }
  },
  async getPostsByUserId(id) {
    try {
      const response = await api.get(`/blogs/user/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FECTH POSTS BY USER ID", error);
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
      const response = await api.post(`/blogs/unlikey/${postId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNLIKE POST!!", error);
      throw error;
    }
  },
};
