// stores/modalStore.js
import { defineStore } from "pinia";
import blogService from "@/services/blogService";
import { useUserStore } from "./userStore";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isModalOpen: false,
    isInEditMode: false,
    postBeingEdited: null,
    isUserEditOpen: false,
    userBeingEdited: null,
  }),
  actions: {
    openModalForCreate() {
      this.isModalOpen = true;
      this.isInEditMode = false;
      this.postBeingEdited = null;
    },
    openModalForEdit(post) {
      console.log(post);
      this.isModalOpen = true;
      this.isInEditMode = true;
      this.postBeingEdited = post;
    },
    openModalForEditUser(user) {
      console.log(user);
      this.isUserEditOpen = true;
      this.userBeingEdited = user;
    },
    closeModal() {
      this.isModalOpen = false;
      this.isInEditMode = false;
      this.postBeingEdited = null;
    },
    async createPost(postData) {
      const response = await blogService.createPost(postData);
      console.log(response);
      return response;
    },
    async updatePost(postId, postData) {
      const response = await blogService.updatePost(postId, postData);
      console.log(response);
      const userStore = useUserStore();
      userStore.syncChanges(postId, response.data);
      return response;
    },
  },
  getters: {
    getPostBeingEdited: (state) => state.postBeingEdited,
  },
});
