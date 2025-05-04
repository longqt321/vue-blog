import api from "./api";

export default {
  async getPopularHashtags() {
    try {
      const response = await api.get(`hashtags/popular`);
      return response.data;
    } catch (error) {
      console.error("ERROR FECTH POPULAR HASHTAGS", error);
    }
  },
};
