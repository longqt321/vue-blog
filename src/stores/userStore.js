import { defineStore } from "pinia";
import userService from "@/services/userService";
import defaultAvatar from "@/assets/avatar.jpg";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
  }),
  actions: {
    async fetchUsers() {
      try {
        const data = await userService.getUsers();
        this.users = data.map((user) => ({
          id: user.id,
          lastName: user.lastName,
          firstName: user.firstName,
          avatar: defaultAvatar,
        }));
      } catch (error) {
        console.error("ERROR FETCH USERS", error);
      }
    },
  },
  getters: {
    getUsers: (state) => state.users,
    getUserById: (state) => (id) => {
      return state.users.find((user) => user.id === id);
    },
    getUserFullName: (state) => (user) => {
      if (!user) return "Unknown";
      return `${user.lastName} ${user.firstName}`;
    },
  },
});
