<script setup>
import { computed } from "vue";
import { useBlogStore } from "@/stores/blogStore";

const blogStore = useBlogStore();
const openModal = () => {
  blogStore.openModal();
};
</script>

<template>
  <div class="relative">
    <textarea
      class="w-full p-4 h-28 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-blue-50/30 placeholder-blue-400"
      placeholder="Share your knowledge, ideas, or questions with the community..."
      @click="openModal"
      readonly
    ></textarea>
  </div>
</template>

