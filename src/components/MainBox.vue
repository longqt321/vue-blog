<script setup>
import { computed, onMounted, watch, inject } from "vue";
import CreatePostArea from "./CreatePostArea.vue";
import BlogPost from "./BlogPost.vue";

import { useBlogStore } from "@/stores/blogStore";
import { useAuthStore } from "@/stores/authStore";
import PostCreationModal from "./PostCreationModal.vue";

// Stores
const blogStore = useBlogStore();
const authStore = useAuthStore();

// Reactivity
const isAuthenticated = computed(() => authStore.isAuthenticated);
const posts = computed(() => blogStore.getPublicPosts);
const isLoading = computed(() => blogStore.isLoading);
const error = computed(() => blogStore.getError);

const loadMore = () => {
  console.log("LOAD MORE!!");
  return blogStore.loadMorePublicPosts();
};

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
  <PostCreationModal />
  <div class="space-y-6">
    <!-- Create Post Section -->
    <div
      class="card bg-white rounded-xl shadow-sm overflow-hidden"
      v-if="isAuthenticated"
    >
      <div class="p-5">
        <h2 class="text-xl font-bold text-blue-800 mb-4">Tạo bài viết mới</h2>
        <CreatePostArea />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <va-progress-circle indeterminate color="primary" />
      <span class="ml-3 text-blue-700 font-medium">Đang tải bài viết...</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-white rounded-xl shadow-sm p-6 text-center"
    >
      <va-icon name="error_outline" size="large" color="#EF4444" />
      <h3 class="mt-4 text-lg font-medium text-gray-800">Có lỗi xảy ra</h3>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <va-button
        color="primary"
        class="mt-4"
        @click="blogStore.fetchPublicPosts()"
      >
        Thử lại
      </va-button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="posts.length === 0"
      class="bg-white rounded-xl shadow-sm p-8 text-center"
    >
      <h3 class="mt-4 text-lg font-medium text-gray-800">
        Chưa có bài viết nào
      </h3>
      <p class="mt-2 text-gray-600">
        Hãy là người đầu tiên chia sẻ suy nghĩ của bạn với cộng đồng!
      </p>
    </div>

    <!-- Posts Display -->
    <div v-else class="space-y-5">
      <BlogPost v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
