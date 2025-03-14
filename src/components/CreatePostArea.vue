<script setup>
import { computed } from "vue";
import { useBlogStore } from "@/stores/blogStore";

const blogStore = useBlogStore();
const openModal = () => {
  blogStore.openModal();
};
</script>

<template>
  <div>
    <textarea
      class="w-full h-16 p-4 resize-none rounded-sm border-1"
      placeholder="Write something..."
      readonly
      @click="openModal"
    ></textarea>
  </div>
</template>
