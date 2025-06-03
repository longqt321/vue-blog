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

const handleTagClick = (tag) => {
  searchQuery.value = `#${tag}`;
  performSearch(searchQuery.value);
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 sticky top-20"
  >
    <!-- Header Section -->
    <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <h2 class="text-lg font-bold flex items-center gap-2">
        Discover Content
        <span class="relative group">
          <va-icon
            name="help_outline"
            size="small"
            class="ml-1 cursor-pointer"
          />
          <div
            class="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-72 bg-white text-blue-900 text-sm rounded shadow-lg p-3 border border-blue-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
          >
            <div class="font-semibold mb-1">Hướng dẫn tìm kiếm:</div>
            <ul class="list-disc pl-5">
              <li><b>#tag</b> — Tìm theo hashtag. Ví dụ: <b>#toanhoc</b></li>
              <li>
                <b>@username</b> — Tìm theo tên đăng nhập. Ví dụ:
                <b>@longtran123</b>
              </li>
              <li>
                <b>!author</b> — Tìm theo họ tên tác giả. Ví dụ: <b>!nguyen</b>
              </li>
              <li><b>từ khóa</b> — Tìm trong tiêu đề bài viết.</li>
              <li>Có thể kết hợp nhiều tiêu chí, cách nhau bằng dấu phẩy.</li>
              <li>Ví dụ: <b>#toanhoc, @longtran123, !nguyen</b></li>
            </ul>
          </div>
        </span>
      </h2>
    </div>
    <!-- Search Section -->
    <div class="p-4 border-b border-blue-50">
      <SearchBar
        v-model="searchQuery"
        placeholder="Tìm kiếm bài viết, hashtag, người dùng..."
      />
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
          class="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
          @click="handleTagClick(tag)"
        >
          #{{ tag }}
        </va-chip>
      </div>
    </div>
  </div>
</template>
