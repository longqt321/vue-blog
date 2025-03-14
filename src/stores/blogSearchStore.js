import { defineStore } from "pinia";

export const useBlogSearchStore = defineStore("blogSearch", {
  state: () => ({
    query: "",
  }),
  actions: {
    setQuery(query) {
      console.log("setQuery", query);
      this.query = query;
    },
  },
  getters: {
    getQuery: (state) => state.query,
  },
});
