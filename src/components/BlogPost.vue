<template>
  <article
    class="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 transition duration-200 hover:shadow-md"
  >
    <!-- Header -->
    <div class="flex justify-between items-start p-5 border-b border-blue-50">
      <div class="flex items-start">
        <div
          @click="goToProfile"
          class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0 cursor-pointer"
        >
          <DynamicImage
            :imageId="post.author?.avatarId"
            :alt="`${post.author?.firstName} ${post.author?.lastName} avatar`"
            container-class="w-full h-full"
            image-class="w-full h-full object-cover"
            loading-size="20px"
            placeholder-icon-size="medium"
            error-icon-size="medium"
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
              :is-hidden="isHidden"
              :is-blocking-owner="isBlockingOwner"
              :is-following-owner="isFollowingOwner"
              @edit-post="handleEditPost"
              @hide-post="handleHidePost"
              @save-post="handleSavePost"
              @block-user="handleBlockUser"
              @follow-user="handleFollowUser"
              @delete-post="handleDeletePost"
              @report="handleReport"
              @copy-markdown="handleCopyMarkDown"
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
          class="cursor-pointer text-xs"
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
          v-if="!isPostOwner"
          @click="handleLikePost"
          :class="[
            'cursor-pointer flex items-center',
            isLiked ? 'text-blue-600' : 'text-gray-600',
          ]"
        >
          <va-icon name="thumb_up" />
          <span class="ml-1 text-sm">Thích</span>
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
import DynamicImage from "./DynamicImage.vue";
import { useUserStore } from "@/stores/userStore";
import { useModalStore } from "@/stores/modalStore";
import userService from "@/services/userService";
import { useRouter } from "vue-router";

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
const router = useRouter();

// UI state
const contentRef = ref(null);
const contentTooLong = ref(false);
const expanded = ref(false);
const showOptionsDropdown = ref(false);
const dropdownRef = ref(null);

// Post state
const isSaved = ref(props.post.relationship.saved);
const isLiked = ref(props.post.relationship.liked);
const isHidden = ref(props.post.relationship.hidden);
const isBlockingOwner = ref(false);
const isFollowingOwner = ref(false);
const isPrivate = computed(() => props.post.visibility == "PRIVATE");

const isPostOwner = computed(() => {
  if (!authStore.isAuthenticated || !props.post.author) return false;
  return authStore.getUser.id === props.post.author.id;
});

const toggleOptionsDropdown = () => {
  showOptionsDropdown.value = !showOptionsDropdown.value;
};

const goToProfile = () => {
  router.push({ name: "profile", params: { id: props.post.author.id } });
};

const handleLikePost = async () => {
  try {
    if (isLiked.value) {
      await blogStore.unlikePost(props.post.id);
    } else {
      await blogStore.likePost(props.post.id);
    }
    await refreshPost();
  } catch (error) {
    console.error("Failed to toggle like status", error);
    // Could show a toast notification here
  }
};

const handleClickOutside = (event) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target) &&
    showOptionsDropdown.value
  ) {
    showOptionsDropdown.value = false;
  }
};

const handleEditPost = (postId) => {
  console.log(`Edit post with id ${postId}`);
  showOptionsDropdown.value = false;
  modalStore.openModalForEdit(props.post);
};

const handleHidePost = async (postId) => {
  console.log(`Hide post with id ${postId}`);
  showOptionsDropdown.value = false;
  try {
    if (isHidden.value) {
      await blogService.unhidePost(postId);
      userStore.removeHiddenPostById(postId);
    } else {
      await blogService.hidePost(postId);
      blogStore.removePostById(postId);
    }
    await refreshPost();
  } catch (error) {
    console.error("Failed to hide post", error);
  }
};

const handleSavePost = async (postId) => {
  try {
    if (isSaved.value) {
      await blogService.unsavePost(postId);
      userStore.removeSavedPostById(postId);
    } else {
      await blogService.savePost(postId);
    }
    showOptionsDropdown.value = false;
    await refreshPost();
  } catch (error) {
    console.error(error);
  }
};

// Refresh data để đồng bộ với CSDL
async function refreshPost() {
  if (props.post.id) {
    try {
      const response = await blogService.getPosts({ id: props.post.id });
      const postData = response.data?.content?.[0] || response.data;
      // console.log("Post data refreshed:", postData);
      // console.log(response);
      if (postData) {
        isSaved.value = postData.relationship?.saved;
        isHidden.value = postData.relationship?.hidden;
        isLiked.value = postData.relationship?.liked;
      }
    } catch (e) {
      console.error("Failed to refresh post data", e);
    }
  }
  if (props.post.author?.id) {
    try {
      const response = await userService.getRelationship(props.post.author.id);
      isBlockingOwner.value = response.data === "BLOCKING";
      isFollowingOwner.value = response.data === "FOLLOWING";
    } catch (e) {
      isBlockingOwner.value = false;
      isFollowingOwner.value = false;
    }
  }
}

const handleBlockUser = async (userId) => {
  try {
    if (isBlockingOwner.value) {
      await userService.unblockUser(userId);
    } else {
      await userService.blockUser(userId);
    }
    await refreshPost();
    showOptionsDropdown.value = false;
  } catch (error) {
    console.error("Failed to block user", error);
  }
  showOptionsDropdown.value = false;
};

const handleFollowUser = async (userId) => {
  try {
    if (isFollowingOwner.value) {
      await userService.unfollowUser(userId);
    } else {
      await userService.followUser(userId);
    }
    await refreshPost();
    showOptionsDropdown.value = false;
  } catch (error) {
    console.error("Failed to follow/unfollow user", error);
  }
};

const handleDeletePost = async (postId) => {
  try {
    const deleteConfirm = confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!deleteConfirm) return;
    showOptionsDropdown.value = false;
    await blogService.deletePost(postId);
    blogStore.removePostById(postId);
    userStore.removePersonalPostById(postId);
  } catch (error) {
    console.error("Failed to delete post", error);
  }
};

const handleReport = async (postId) => {
  try {
    console.log(`Report post with id ${postId}`);
    showOptionsDropdown.value = false;
    await blogService.reportPost(postId);
  } catch (error) {
    console.error("Failed to report post", error);
  }
};

const handleCopyMarkDown = async (mdContent) => {
  try {
    await navigator.clipboard.writeText(mdContent);
  } catch (error) {
    console.error("Failed to copy markdown content", error);
  }
};

onMounted(async () => {
  await nextTick();
  if (contentRef.value && contentRef.value.scrollHeight > 320) {
    contentTooLong.value = true;
  }
  if (props.post.author?.id) {
    await refreshPost();
  }
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  // Clean up the event listener when component is unmounted
  document.removeEventListener("click", handleClickOutside);
});
</script>
