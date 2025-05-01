<script setup>
import { ref, computed, watch } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { MdPreview, MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const blogStore = useBlogStore();
const isOpen = computed(() => blogStore.isModalOpen);
const title = ref("");
const textContent = ref("");
const closeModal = () => {
  blogStore.closeModal();
};

// Reset form when modal is closed
watch(isOpen, (newVal) => {
  if (!newVal) {
    title.value = "";
    textContent.value = "";
  }
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        @click="closeModal"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block w-full max-w-7xl px-6 pt-6 pb-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-8"
      >
        <!-- Header -->
        <div class="mb-2">
          <h3 class="text-3xl font-bold text-blue-800 text-center">
            Create New Post
          </h3>
        </div>

        <!-- Body -->
        <div class="">
          <!-- Editor -->
          <div
            class="h-[calc(100vh-280px)] border border-blue-100 rounded-lg bg-white p-4"
          >
            <MdEditor
              :style="{ height: '100%' }"
              language="en-US"
              v-model="textContent"
            ></MdEditor>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="mt-6 border-t border-blue-100 flex justify-between items-center"
        >
          <!-- Save draft -->
          <va-button outlined color="primary" class="px-4">
            Save Draft
          </va-button>
        </div>
      </div>
    </div>
  </div>
</template>
