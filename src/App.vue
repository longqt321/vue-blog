<script setup>
import { onMounted, provide } from "vue";
import { useUserStore } from "./stores/userStore";
import { useBlogStore } from "./stores/blogStore";
import { useAuthStore } from "./stores/authStore";
import PostCreationModal from "./components/PostCreationModal.vue";

const blogStore = useBlogStore();
const userStore = useUserStore();
const authStore = useAuthStore();

const BYPASS_AUTH = false;

onMounted(() => {
  if (BYPASS_AUTH) {
    authStore.enableSkipAuth();
  } else {
    authStore.disableSkipAuth();
  }
});

// Configure Vuestic UI theme settings
provide("vuestic-config", {
  colors: {
    primary: "#3B82F6", // Blue-500
    secondary: "#1E40AF", // Blue-800
    success: "#10B981", // Green-500
    info: "#60A5FA", // Blue-400
    danger: "#EF4444", // Red-500
    warning: "#F59E0B", // Amber-500
    background: "#F3F4F6", // Gray-100
  },
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-blue-50 text-gray-800 font-sans">
    <router-view class="flex-1"></router-view>
    <PostCreationModal />
  </div>
</template>

<style>
/* Import the custom scrollbar styles from main.css */
@import "./assets/main.css";

/* Global styles */
:root {
  --primary: #3b82f6;
  --primary-dark: #1e40af;
  --primary-light: #93c5fd;
}

/* Force scrollbar to always be visible to avoid layout shifts */
html {
  overflow-y: scroll;
}

/* Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
