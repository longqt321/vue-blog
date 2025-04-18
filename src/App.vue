<script setup>
import { onMounted } from "vue";
import { useUserStore } from "./stores/userStore";
import { useBlogStore } from "./stores/blogStore";
import NavBar from "./components/NavBar.vue";
import PostCreationModal from "./components/PostCreationModal.vue";

const blogStore = useBlogStore();
const userStore = useUserStore();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <router-view class="flex-1"></router-view>
    <PostCreationModal />
  </div>
</template>
