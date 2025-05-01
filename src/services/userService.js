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
      console.log("USER SERVICE");
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("ERROR FETCH USER BY ID!!", error);
      throw error;
    }
  },
};
