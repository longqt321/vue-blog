import api from "./api";

export default {
  async getPosts() {
    try {
      const response = await api.get("/posts");
      return response.data.posts;
    } catch (error) {
      console.error("ERROR FETCH POSTS!!", error);
      throw error;
    }
  },
  async getPostById(id) {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH POST BY ID!!", error);
      throw error;
    }
  },
  async updatePost(id, newPostData) {
    try {
      const response = await api.put(`/posts/${id}`, newPostData);
      return response.data;
    } catch (error) {
      console.error("ERROR UPDATE POST!!", error);
      throw error;
    }
  },
  async deletePost(id) {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR DELETE POST!!", error);
      throw error;
    }
  },
};
