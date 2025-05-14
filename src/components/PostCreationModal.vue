<script setup>
import { ref, computed, watch } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { MdPreview, MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";
import { useModalStore } from "@/stores/modalStore";

const blogStore = useBlogStore();
const authStore = useAuthStore();
const modalStore = useModalStore();

// Reactive state
const title = ref("");
const textContent = ref("");
const isLoading = ref(false);
const selectedVisibility = ref("");
const hashtagInput = ref("");
const hashtags = ref([]);
const error = ref(null);
const editingPostId = ref(null);

// Computed properties
const isOpen = computed(() => modalStore.isModalOpen);
const isEditMode = computed(() => modalStore.isInEditMode);
const isFormValid = computed(
  () => title.value.trim() !== "" && textContent.value.trim() !== ""
);

// Populate form with post data when in edit mode
watch(
  () => modalStore.getPostBeingEdited,
  (post) => {
    if (post) {
      title.value = post.title || "";
      textContent.value = post.body || "";
      selectedVisibility.value = post.visibility || "PUBLIC";
      hashtags.value = [...(post.hashtags || [])];
      editingPostId.value = post.id;
    }
  },
  { immediate: true }
);

// Methods
const closeModal = () => {
  modalStore.closeModal();
  error.value = null;
};

const addHashtag = () => {
  const tag = hashtagInput.value.trim().replace(/\s+/g, "-").toLowerCase();
  if (tag && /^[a-zA-Z0-9-]+$/.test(tag) && !hashtags.value.includes(tag)) {
    hashtags.value.push(tag);
    hashtagInput.value = "";
  }
};

const removeHashtag = (index) => {
  hashtags.value.splice(index, 1);
};

const submitPost = async () => {
  if (!isFormValid.value) {
    error.value = "Please fill in both title and content fields.";
    return;
  }

  error.value = null;
  isLoading.value = true;

  const postData = {
    title: title.value,
    body: textContent.value,
    author: authStore.getUser,
    hashtags: hashtags.value,
    visibility: selectedVisibility.value,
  };

  try {
    if (isEditMode.value && editingPostId.value) {
      // Update existing post using blogStore
      await modalStore.updatePost(editingPostId.value, postData);
    } else {
      // Create new post using blogStore
      await modalStore.createPost(postData);
    }
    modalStore.closeModal();
  } catch (err) {
    console.error("ERROR PROCESSING POST", err);
    error.value = "There was a problem saving your post. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

// Reset form when modal is closed
watch(isOpen, (newVal) => {
  if (!newVal) {
    title.value = "";
    textContent.value = "";
    selectedVisibility.value = "PUBLIC";
    hashtags.value = [];
    editingPostId.value = null;
    error.value = null;
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
        <!-- Error message if there is one -->
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>

        <!-- Header -->
        <div class="mb-6 flex flex-col items-center">
          <h3 class="text-3xl font-bold text-blue-800 text-center mb-4">
            {{ isEditMode ? "Edit Post" : "Create New Post" }}
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

        <!-- Visibility and Hashtags -->
        <div class="mt-4 flex flex-wrap items-center gap-4">
          <!-- Visibility Options -->
          <div class="flex items-center gap-4">
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
          </div>

          <!-- Hashtag Input -->
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <input
                v-model="hashtagInput"
                @keyup.enter="addHashtag"
                type="text"
                placeholder="Add a hashtag and press Enter..."
                class="w-full px-3 py-2 text-sm border-b-2 border-blue-200 focus:border-blue-500 outline-none pr-8"
              />
              <button
                @click="addHashtag"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
              >
                <va-icon name="add" />
              </button>
            </div>
          </div>
        </div>

        <!-- Hashtag Display -->
        <div class="flex flex-wrap gap-2 items-center mt-3">
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

          <div
            v-if="hashtags.length === 0"
            class="text-gray-400 text-sm italic"
          >
            No hashtags added yet
          </div>
        </div>

        <!-- Footer -->
        <div
          class="mt-6 border-t border-blue-100 flex justify-between items-center pt-4"
        >
          <va-button outlined color="primary" class="px-4" @click="closeModal">
            Cancel
          </va-button>
          <va-button
            @click="submitPost"
            outlined
            color="primary"
            class="px-4"
            :loading="isLoading"
            :disabled="!isFormValid"
          >
            {{ isEditMode ? "Update" : "Post" }}
          </va-button>
        </div>
      </div>
    </div>
  </div>
</template>
