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
          @click="filterByTag(tag)"
          class="cursor-pointer"
        >
          #{{ tag }}
        </va-chip>
      </div>
    </div>

    <!-- Recommended Blogs Section -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium text-blue-800">Recommended Posts</h3>
        <button class="text-xs text-blue-600 hover:underline">See All</button>
      </div>

      <!-- Loading State -->
      <div v-if="blogStore.isLoading" class="py-3 text-center">
        <va-progress-circle indeterminate color="primary" size="small" />
      </div>

      <!-- Recommended Posts -->
      <div v-else class="space-y-3 max-h-96 overflow-y-auto scrollbar-custom">
        <RecommendedBlog
          v-for="post in recommendedBlogs.slice(0, 5)"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>

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

// Popular tags that could be derived from actual data in a real app
const popularTags = ref([
  "programming",
  "design",
  "technology",
  "education",
  "travel",
]);

const debouncedSearch = debounce((newQuery) => {
  blogSearchStore.setQuery(newQuery);
}, 300);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const filterByTag = (tag) => {
  searchQuery.value = `#${tag}`;
  blogSearchStore.setQuery(`#${tag}`);
};
</script>
