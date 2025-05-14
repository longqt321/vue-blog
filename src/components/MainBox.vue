<script setup>
import { computed, onMounted, watch } from "vue";
import CreatePostArea from "./CreatePostArea.vue";
import BlogPost from "./BlogPost.vue";

import { useBlogStore } from "@/stores/blogStore";
import { useBlogSearchStore } from "@/stores/blogSearchStore";
import { useAuthStore } from "@/stores/authStore";

// Stores
const blogStore = useBlogStore();
const blogSearchStore = useBlogSearchStore();
const authStore = useAuthStore();

// Reactivity
const isAuthenticated = computed(() => authStore.isAuthenticated);
const posts = computed(() =>
  blogSearchStore.getQuery
    ? blogSearchStore.getResults
    : blogStore.getPublicPosts
);
const isLoading = computed(() => blogStore.isPostsLoading);
const error = computed(() => blogStore.getError);
const searchActive = computed(() => blogSearchStore.getQuery !== "");

// On first mount, fetch posts (PUBLIC only)
onMounted(async () => {
  if (!blogStore.getPublicPosts.length) {
    await blogStore.fetchPublicPosts();
  }
});

// Watch login state to refetch PUBLIC posts
watch(
  () => authStore.isAuthenticated,
  async (newValue) => {
    if (newValue) {
      await blogStore.fetchPublicPosts();
    }
  }
);
</script>

<template>
  <div class="space-y-6">
    <!-- Create Post Section -->
    <div
      class="card bg-white rounded-xl shadow-sm overflow-hidden"
      v-if="isAuthenticated"
    >
      <div class="p-5">
        <h2 class="text-xl font-bold text-blue-800 mb-4">Create New Post</h2>
        <CreatePostArea />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <va-progress-circle indeterminate color="primary" />
      <span class="ml-3 text-blue-700 font-medium">Loading posts...</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-white rounded-xl shadow-sm p-6 text-center"
    >
      <va-icon name="error_outline" size="large" color="#EF4444" />
      <h3 class="mt-4 text-lg font-medium text-gray-800">
        Something went wrong
      </h3>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <va-button
        color="primary"
        class="mt-4"
        @click="blogStore.fetchPublicPosts()"
      >
        Try Again
      </va-button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="posts.length === 0"
      class="bg-white rounded-xl shadow-sm p-8 text-center"
    >
      <va-icon name="article_off" size="large" color="#4B5563" />
      <h3 class="mt-4 text-lg font-medium text-gray-800">No posts yet</h3>
      <p class="mt-2 text-gray-600">
        Be the first to share your thoughts with the community!
      </p>
      <va-button
        v-if="isAuthenticated"
        color="primary"
        class="mt-4"
        @click="blogStore.openModal()"
      >
        Create Your First Post
      </va-button>
    </div>

    <!-- Search-specific Empty State -->
    <div
      v-else-if="searchActive && posts.length === 0"
      class="bg-white rounded-xl shadow-sm p-8 text-center"
    >
      <va-icon name="search_off" size="large" color="#4B5563" />
      <h3 class="mt-4 text-lg font-medium text-gray-800">No results found</h3>
      <p class="mt-2 text-gray-600">
        We couldn't find any posts matching your search criteria.
      </p>
      <va-button
        color="primary"
        class="mt-4"
        @click="blogSearchStore.setQuery('')"
      >
        Clear Search
      </va-button>
    </div>

    <!-- Posts Display -->
    <div v-else class="space-y-5">
      <BlogPost v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
