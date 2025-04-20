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
        class="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between mb-6 border-b border-blue-100 pb-4"
        >
          <h3 class="text-2xl font-bold text-blue-800">Create New Post</h3>
          <div class="flex space-x-2">
            <va-button color="primary" icon="publish" class="px-4">
              Publish
            </va-button>
            <va-button
              icon="close"
              flat
              color="#64748B"
              @click="closeModal"
              class="text-gray-500"
            />
          </div>
        </div>

        <!-- Body -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Editor -->
          <div class="h-96 border border-blue-100 rounded-lg bg-white p-4">
            <!-- Title input -->
            <div class="mb-4">
              <va-input
                v-model="title"
                placeholder="Post title"
                class="w-full"
                color="primary"
              />
            </div>
            <!-- Content textarea -->
            <textarea
              v-model="textContent"
              class="w-full h-[calc(100%-80px)] p-2 border border-blue-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your post content here..."
            ></textarea>
          </div>

          <!-- Preview -->
          <div
            class="h-96 border border-blue-100 rounded-lg overflow-auto p-4 bg-blue-50/30"
          >
            <div class="prose prose-blue max-w-none">
              <h2 class="text-xl font-bold text-blue-800">
                {{ title || "Post Title" }}
              </h2>
              <div class="mt-4 whitespace-pre-line">
                {{ textContent || "Your post content will appear here..." }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="mt-6 pt-4 border-t border-blue-100 flex justify-between items-center"
        >
          <!-- Left tools -->
          <div class="flex space-x-2">
            <va-button
              icon="image"
              flat
              color="primary"
              class="hover:bg-blue-50"
            >
              Add Image
            </va-button>
            <va-button icon="tag" flat color="primary" class="hover:bg-blue-50">
              Add Tags
            </va-button>
          </div>

          <!-- Save draft -->
          <va-button outlined color="primary" class="px-4">
            Save Draft
          </va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useBlogStore } from "@/stores/blogStore";

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
