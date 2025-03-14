import api from "./api";

export default {
  async getUsers() {
    try {
      const response = await api.get("/users");
      return response.data.users;
    } catch (error) {
      console.error("ERROR FETCH USERS!!", error);
      throw error;
    }
  },
};
