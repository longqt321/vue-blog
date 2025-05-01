<script setup>
import { ref, computed, onMounted } from "vue";
import CreatePostArea from "./CreatePostArea.vue";
import { useBlogStore } from "@/stores/blogStore";
import { useBlogSearchStore } from "@/stores/blogSearchStore";
import BlogPost from "./BlogPost.vue";
import blogService from "@/services/blogService";

const posts = ref([]);
const isLoading = ref(false);

const fetchPosts = async () => {
  isLoading.value = true;
  try {
    posts.value = await blogService.getPosts();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchPosts();
});
</script>
<template>
  <div class="space-y-6">
    <!-- Create Post Section -->
    <div class="card bg-white rounded-xl shadow-sm overflow-hidden">
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

    <!-- Posts Display -->
    <div v-else class="space-y-5">
      <div v-if="posts.length === 0" class="card p-8 text-center">
        <va-icon name="article_off" size="large" color="#4285F4" />
        <p class="mt-3 text-gray-500">
          No posts found. Be the first to share something!
        </p>
      </div>

      <BlogPost v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
