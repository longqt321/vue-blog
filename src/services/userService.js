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

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH USER BY ID!!", error);
      throw error;
    }
  },

  async getRelationship(targetId) {
    try {
      const response = await api.get(`/users/relationship/${targetId}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH RELATIONSHIP!!", error);
      throw error;
    }
  },

  // Follow a user
  async followUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error("ERROR FOLLOW USER!!", error);
      throw error;
    }
  },

  // Unfollow a user
  async unfollowUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNFOLLOW USER!!", error);
      throw error;
    }
  },

  // Block a user
  async blockUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/block`);
      return response.data;
    } catch (error) {
      console.error("ERROR BLOCK USER!!", error);
      throw error;
    }
  },

  // Unblock a user
  async unblockUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/unblock`);
      return response.data;
    } catch (error) {
      console.error("ERROR UNBLOCK USER!!", error);
      throw error;
    }
  },

  // Update user profile
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("ERROR UPDATE PROFILE!!", error);
      throw error;
    }
  },
};
