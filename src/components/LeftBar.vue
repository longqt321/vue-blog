<script setup>
import { ref, computed, watch } from "vue";
import { debounce } from "lodash";
import SearchBar from "./SearchBar.vue";
import { useBlogStore } from "@/stores/blogStore";
import { useBlogSearchStore } from "@/stores/blogSearchStore";
import RecommendedBlog from "./RecommendedBlog.vue";

const blogStore = useBlogStore();
const blogSearchStore = useBlogSearchStore();
const searchQuery = ref(blogSearchStore.getQuery);
const recommendedBlogs = computed(() => blogStore.getPosts);

const debouncedSearch = debounce((newQuery) => {
  blogSearchStore.setQuery(newQuery);
}, 300);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});
</script>

<template>
  <div
    class="sticky top-[64px] h-[calc(100vh-64px)] bg-blue-100 p-4 overflow-y-auto scrollbar-custom"
  >
    <div class="flex flex-col justify-between h-full">
      <div class="flex-1">
        <h2 class="text-xl font-bold mb-4">Search and filter</h2>

        <SearchBar v-model="searchQuery" />
      </div>
      <h2 class="text-xl font-bold mb-4">Recommended blogs</h2>

      <div class="flex-5 overflow-y-auto scrollbar-custom">
        <div v-if="blogStore.isLoading">Loading...</div>
        <div v-else v-for="post in recommendedBlogs" :key="post.id">
          <RecommendedBlog :post="post" />
        </div>
      </div>
      <div class="flex-2"></div>
    </div>
  </div>
</template>
