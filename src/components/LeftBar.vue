<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { debounce } from "lodash";
import SearchBar from "./SearchBar.vue";
import { useBlogStore } from "@/stores/blogStore";
import hashtagService from "@/services/hashtagService";

// Stores
const blogStore = useBlogStore();

// Popular tags that could be derived from actual data in a real app
const popularTags = ref([]);
const searchQuery = ref("");

onMounted(async () => {
  if (!popularTags.value.length) {
    popularTags.value = await hashtagService.getPopularHashtags();
  }
});

const performSearch = async (query) => {
  console.log("Searching for:", query);
  blogStore.searchQuery = searchQuery.value;
  // gọi API hoặc filter ở đây
  await blogStore.fetchPublicPosts();
};

const debouncedSearch = debounce(performSearch, 500);

// Watch query
watch(searchQuery, (newVal) => {
  debouncedSearch(newVal);
});
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 sticky top-20"
  >
    <!-- Header Section -->
    <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <h2 class="text-lg font-bold">Discover Content</h2>
    </div>

    <!-- Search Section -->
    <div class="p-4 border-b border-blue-50">
      <div class="relative">
        <SearchBar v-model="searchQuery" />
      </div>
    </div>

    <!-- Filter Section -->
    <div class="p-4 border-b border-blue-50">
      <h3 class="font-medium text-blue-800 mb-3">Popular Tags</h3>
      <div class="flex flex-wrap gap-2">
        <va-chip
          v-for="tag in popularTags"
          :key="tag"
          size="small"
          color="primary"
          outlined
          class="cursor-pointer"
        >
          #{{ tag }}
        </va-chip>
      </div>
    </div>
  </div>
</template>
