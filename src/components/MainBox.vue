<script setup>
import { ref, computed, onMounted } from "vue";
import CreatePostArea from "./CreatePostArea.vue";
import { useBlogStore } from "@/stores/blogStore";
import { useBlogSearchStore } from "@/stores/blogSearchStore";
import BlogPost from "./BlogPost.vue";

const blogStore = useBlogStore();
const searchStore = useBlogSearchStore();

const posts = computed(() => blogStore.searchBlogs(searchStore.getQuery));
</script>
<template>
  <div class="h-full bg-white p-4">
    <CreatePostArea />
    <div v-if="blogStore.isLoading">Loading...</div>
    <BlogPost v-else v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>
