import api from "./api";

export default {
  async getUsers() {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH USERS!!", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/user/current");
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH USER BY ID!!", error);
      throw error;
    }
  },

  // Follow a user
  async followUser(userId) {
    try {
      const response = await api.post(`/users/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FOLLOW USER!!", error);
      throw error;
    }
  },

  // Unfollow a user
  async unfollowUser(userId) {
    try {
      const response = await api.post(`/users/unfollow/${userId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNFOLLOW USER!!", error);
      throw error;
    }
  },

  // Block a user
  async blockUser(userId) {
    try {
      const response = await api.post(`/users/block/${userId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR BLOCK USER!!", error);
      throw error;
    }
  },

  // Unblock a user
  async unblockUser(userId) {
    try {
      const response = await api.post(`/users/unblock/${userId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNBLOCK USER!!", error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put("/users/profile", userData);
      return response.data;
    } catch (error) {
      console.error("ERROR UPDATE PROFILE!!", error);
      throw error;
    }
  },
};
