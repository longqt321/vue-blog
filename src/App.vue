<script setup>
import { onMounted } from "vue";
import { useUserStore } from "./stores/userStore";
import { useBlogStore } from "./stores/blogStore";

const blogStore = useBlogStore();
const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUsers();
  await blogStore.fetchPosts();
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <router-view class="flex-1"></router-view>
  </div>
</template>
