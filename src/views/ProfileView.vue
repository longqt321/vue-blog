<script setup>
import { computed } from "vue";

import UserInfoCard from "@/components/UserInfoCard.vue";
import RecommendedBlog from "@/components/RecommendedBlog.vue";
import { useBlogStore } from "@/stores/blogStore";
import { useUserStore } from "@/stores/userStore";
import NavBar from "@/components/NavBar.vue";

const blogStore = useBlogStore();
const userStore = useUserStore();

const recommendedBlogs = computed(() => blogStore.getPosts);
const users = computed(() => userStore.getUsers);

const user = computed(() => {
  return users.value.find((user) => user.id === 1);
});
</script>
<template>
  <NavBar />
  <div class="bg-gray-400 w-full min-h-screen flex justify-center">
    <div
      class="flex flex-col sm:flex-row w-full md:w-[95%] lg:w-[90%] min-h-screen bg-gray-500"
    >
      <div class="w-full sm:w-[40%] md:w-[35%] lg:w-[30%] bg-blue-400">
        <div
          class="flex justify-center min-h-[500px] sm:h-[calc(100vh-64px)] bg-blue-100 p-2 overflow-y-auto scrollbar-custom"
        >
          <div class="flex flex-col justify-between h-full p-1">
            <!-- User info card -->
            <div class="flex w-full h-[55%] bg-blue-600 rounded-2xl pr-2">
              <UserInfoCard :user="user" />
            </div>

            <!-- Recommended blogs  -->
            <div
              class="flex flex-col overflow-y-auto w-full h-[43%] bg-blue-600 rounded-2xl scrollbar-custom p-1"
            >
              <h2 class="text-white text-center font-bold text-lg">
                Recommended Blogs
              </h2>
              <div v-if="blogStore.isLoading">Loading...</div>
              <div v-else v-for="post in recommendedBlogs" :key="post.id">
                <RecommendedBlog :post="post" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full sm:w-[60%] bg-red-400"></div>
    </div>
  </div>
</template>
