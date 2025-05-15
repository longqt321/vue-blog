<template>
  <article
    class="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 transition duration-200 hover:shadow-md"
  >
    <!-- Header -->
    <div class="flex justify-between items-start p-5 border-b border-blue-50">
      <div class="flex items-start">
        <div
          class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0"
        >
          <img
            :src="post.author?.avatar || '../assets/avatar.jpg'"
            class="w-full h-full object-cover"
            alt="Author avatar"
          />
        </div>
        <div class="ml-3">
          <h3 class="font-semibold text-blue-900">
            {{ post.author?.lastName }} {{ post.author?.firstName }}
          </h3>
          <span class="text-gray-600">#{{ post.author?.username }}</span>
        </div>
      </div>

      <div class="flex space-x-1">
        <span
          v-if="isPrivate"
          class="flex items-center justify-center mr-4 text-red-500 font-bold"
          >{{ post.visibility }}</span
        >

        <div class="relative" ref="dropdownRef">
          <va-button
            @click="toggleOptionsDropdown"
            icon="more_horiz"
            round
            size="medium"
            color="#f0f4f9"
            text-color="#4B5563"
            class="hover:bg-blue-50"
          />
          <!-- Post Options Dropdown -->
          <BaseDropdown v-if="showOptionsDropdown" class="w-64 ridght-0">
            <PostOptionsDropdown
              :post="post"
              :is-owner="isPostOwner"
              :is-saved="isSaved"
              @edit-post="handleEditPost"
              @hide-post="handleHidePost"
              @save-post="handleSavePost"
              @block-user="handleBlockUser"
              @delete-post="handleDeletePost"
              @report="handleReport"
            />
          </BaseDropdown>
        </div>
      </div>
    </div>

    <!-- Nội dung bài viết -->
    <div class="p-5">
      <h1 class="text-xl text-center font-bold text-blue-900 mb-3">
        {{ post.title }}
      </h1>

      <div
        ref="contentRef"
        :class="[
          'transition-all duration-300 overflow-hidden relative',
          !expanded && contentTooLong ? 'max-h-[300px]' : 'max-h-full',
        ]"
      >
        <MdPreview
          language="en-US"
          :model-value="post.body"
          class="prose max-w-none"
        />
      </div>

      <!-- Xem thêm / Thu gọn -->
      <div v-if="contentTooLong" class="text-center mt-3">
        <va-button
          preset="secondary"
          size="small"
          @click="expanded = !expanded"
        >
          {{ expanded ? "Thu gọn" : "Xem thêm" }}
        </va-button>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mt-4">
        <va-chip
          v-for="tag in post.hashtags"
          :key="tag"
          size="small"
          color="info"
          outlined
          class="text-xs"
        >
          #{{ tag }}
        </va-chip>
      </div>
    </div>

    <!-- Thời gian -->
    <div class="text-xs text-gray-400 px-5 pb-3">
      Đăng lúc: {{ formatTime(post.createdAt) }}
    </div>

    <!-- Actions -->
    <div class="border-t border-blue-50 p-3 bg-blue-50 flex justify-between">
      <div class="flex space-x-4">
        <button
          @click="handleLikePost"
          :class="[
            'flex items-center',
            isLiked ? 'text-blue-600' : 'text-gray-600',
          ]"
        >
          <va-icon name="thumb_up" />
          <span class="ml-1 text-sm">Like</span>
        </button>
        <!-- <button class="flex items-center text-gray-600 hover:text-blue-600">
          <va-icon name="comment" />
          <span class="ml-1 text-sm">Comment</span>
        </button> -->
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { useAuthStore } from "@/stores/authStore";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { formatTime } from "@/composables/timeFormatter";
import blogService from "@/services/blogService";
import BaseDropdown from "./BaseDropdown.vue";
import PostOptionsDropdown from "./PostOptionsDropdown.vue";
import { useUserStore } from "@/stores/userStore";
import { useModalStore } from "@/stores/modalStore";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const blogStore = useBlogStore();
const userStore = useUserStore();
const modalStore = useModalStore();

// UI state
const contentRef = ref(null);
const contentTooLong = ref(false);
const expanded = ref(false);
const showOptionsDropdown = ref(false);
const dropdownRef = ref(null); // Reference to track the dropdown element

// Post state
const isSaved = ref(props.post.relationship.saved);
const isLiked = ref(props.post.relationship.liked);
const isPrivate = computed(() => props.post.visibility == "PRIVATE");

// Check if current user is the owner of the post
const isPostOwner = computed(() => {
  if (!authStore.isAuthenticated || !props.post.author) return false;
  return authStore.getUser.id === props.post.author.id;
});

const toggleOptionsDropdown = () => {
  showOptionsDropdown.value = !showOptionsDropdown.value;
};

// Handlers for post options
const handleHide = () => {
  // Would typically call a method in the blogStore to hide this post
  console.log(`Hide post with id ${props.post.id}`);
};

const handleLikePost = async () => {
  try {
    if (isLiked.value) {
      await blogStore.unlikePost(props.post.id);
    } else {
      await blogStore.likePost(props.post.id);
    }
    isLiked.value = !isLiked.value;
  } catch (error) {
    console.error("Failed to toggle like status", error);
    // Could show a toast notification here
  }
};

// Click outside detection handler
const handleClickOutside = (event) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target) &&
    showOptionsDropdown.value
  ) {
    showOptionsDropdown.value = false;
  }
};

// Options dropdown handlers
const handleEditPost = (postId) => {
  console.log(`Edit post with id ${postId}`);
  showOptionsDropdown.value = false;
  modalStore.openModalForEdit(props.post);
  // Pass the current post to the blog store for editing
};

const handleHidePost = (postId) => {
  console.log(`Hide post with id ${postId}`);
  showOptionsDropdown.value = false;
  // Additional hide logic would go here
};

const handleSavePost = async (postId) => {
  console.log(`${isSaved.value ? "Unsave" : "Save"} post with id ${postId}`);

  try {
    if (isSaved.value) {
      await blogService.unsavePost(postId);
      userStore.removeSavedPostById(postId);
    } else {
      await blogService.savePost(postId);
    }
    showOptionsDropdown.value = false;
    isSaved.value = !isSaved.value;
  } catch (error) {
    console.error(error);
  }
};

const handleBlockUser = (userId) => {
  console.log(`Hide user with id ${userId}`);
  showOptionsDropdown.value = false;
  // Additional hide user logic would go here
};

const handleDeletePost = async (postId) => {
  console.log(`Delete post with id ${postId}`);
  showOptionsDropdown.value = false;
  await blogService.deletePost(postId);
  blogStore.removePostById(postId);
  userStore.removePersonalPostById(postId);
};

const handleReport = (postId) => {
  console.log(`Report post with id ${postId}`);
  showOptionsDropdown.value = false;
  // Additional report logic would go here
};

onMounted(async () => {
  await nextTick();
  if (contentRef.value && contentRef.value.scrollHeight > 320) {
    contentTooLong.value = true;
  }

  // Add global click event listener to detect clicks outside the dropdown
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  // Clean up the event listener when component is unmounted
  document.removeEventListener("click", handleClickOutside);
});
</script>
