import api from "./api";

export default {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(userInfo) {
    const response = await api.post("/auth/register", userInfo);
    return response.data;
  },
  async confirmEmail(userInfo) {
    const response = await api.post("/auth/confirm-email", userInfo);
    return response.data;
  },
  async resetPassword(data) {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },
};
