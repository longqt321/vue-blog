<script setup>
import { ref, computed, watch } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { MdPreview, MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import blogService from "@/services/blogService";
import { useAuthStore } from "@/stores/authStore";
import { VaButton } from "vuestic-ui";

const blogStore = useBlogStore();
const authStore = useAuthStore();
const isOpen = computed(() => blogStore.isModalOpen);
const title = ref("");
const textContent = ref("");
const isLoading = ref(false);
const selectedVisibility = ref("PUBLIC");
const hashtagInput = ref("");
const hashtags = ref([]);

const closeModal = () => {
  blogStore.closeModal();
};

const addHashtag = () => {
  const tag = hashtagInput.value.trim().replace(/\s+/g, "-").toLowerCase(); // Thay space bằng gạch ngang
  if (tag && /^[a-zA-Z0-9-]+$/.test(tag)) {
    hashtags.value.push(tag);
    hashtagInput.value = "";
  }
};

const removeHashtag = (index) => {
  hashtags.value.splice(index, 1);
};

const upBlog = async () => {
  const content = textContent.value;
  isLoading.value = true;
  try {
    const newPost = {
      title: title.value,
      body: textContent.value,
      author: authStore.getUser,
      hashtags: hashtags.value,
      status: selectedVisibility.value,
    };
    console.log(hashtags.value);
    console.log(newPost);
    await blogService.createPost(newPost);
  } catch (error) {
    console.error("ERROR UPLOAD NEW BLOG", error);
  }
  isLoading.value = false;
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
        <div class="mb-6 flex flex-col items-center">
          <h3 class="text-3xl font-bold text-blue-800 text-center mb-4">
            Create New Post
          </h3>
          <div class="w-full max-w-2xl">
            <input
              v-model="title"
              type="text"
              placeholder="Enter post title here..."
              class="w-full px-4 py-3 text-lg border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-center font-medium"
            />
          </div>
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
        <!-- Visibility -->
        <div class="mt-4 flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="selectedVisibility"
              value="PUBLIC"
              class="text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span class="text-gray-700">Public</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="selectedVisibility"
              value="PRIVATE"
              class="text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span class="text-gray-700">Private</span>
          </label>
          <div class="relative flex-1">
            <input
              v-model="hashtagInput"
              @keyup.enter="addHashtag"
              type="text"
              placeholder="Nhập hashtag và ấn Enter..."
              class="w-[41%] px-3 py-1 text-sm border-b-2 border-blue-200 focus:border-blue-500 outline-none"
            />
            <button
              @click="addHashtag"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
            >
              +
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 items-center w-full">
          <!-- Hiển thị các tag đã thêm -->
          <div
            v-for="(tag, index) in hashtags"
            :key="index"
            class="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-800"
          >
            <span>#{{ tag }}</span>
            <button
              @click="removeHashtag(index)"
              class="ml-1 text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </div>

          <!-- Input thêm tag mới -->
        </div>
        <!-- Footer -->
        <div
          class="mt-6 border-t border-blue-100 flex justify-between items-center"
        >
          <va-button outlined color="primary" class="px-4">
            Save Draft
          </va-button>
          <va-button @click="upBlog" outlined color="primary" class="px-4">
            Post
          </va-button>
        </div>
      </div>
    </div>
  </div>
</template>
