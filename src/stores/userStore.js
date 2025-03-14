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
          class: user.class || "23T_Nhat1",
          school: user.university || "DUT",
          avatar: user.avatar || defaultAvatar,
        }));
      } catch (error) {
        console.error("ERROR FETCH USERS", error);
      }
    },
    addUser(user) {
      this.users.push(user);
    },
    updateUser(id, updatedUser) {
      const userIndex = this.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        this.users[userIndex] = updatedUser;
      }
    },

    deleteUser(id) {
      const index = this.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        this.users.splice(index, 1);
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
