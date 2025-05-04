<template>
  <div class="post-options-dropdown">
    <div class="py-2">
      <!-- Owner options -->
      <template v-if="isOwner">
        <button
          @click="handleEditPost"
          class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
        >
          <va-icon name="edit" color="#3B82F6" class="mr-3" />
          <span>Chỉnh sửa bài viết</span>
        </button>

        <button
          @click="handlePinPost"
          class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
        >
          <va-icon name="push_pin" color="#3B82F6" class="mr-3" />
          <span>{{ isPinned ? "Bỏ ghim bài viết" : "Ghim bài viết" }}</span>
        </button>
        <button
          @click="handleDeletePost"
          class="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center text-red-600 transition-colors duration-200"
        >
          <va-icon name="flag" color="#EF4444" class="mr-3" />
          <span>Xóa bài viết</span>
        </button>
      </template>

      <!-- Non-owner options -->
      <template v-else>
        <button
          @click="handleHidePost"
          class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
        >
          <va-icon name="visibility_off" color="#3B82F6" class="mr-3" />
          <span>Ẩn bài viết</span>
        </button>

        <button
          @click="handleSavePost"
          class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
        >
          <va-icon name="bookmark" color="#3B82F6" class="mr-3" />
          <span>{{ isSaved ? "Bỏ lưu bài viết" : "Lưu bài viết" }}</span>
        </button>

        <button
          @click="handleHideUser"
          class="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
        >
          <va-icon name="person_off" color="#3B82F6" class="mr-3" />
          <span>Ẩn người dùng này</span>
        </button>
        <button
          @click="handleReport"
          class="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center text-red-600 transition-colors duration-200"
        >
          <va-icon name="flag" color="#EF4444" class="mr-3" />
          <span>Báo cáo bài viết</span>
        </button>
      </template>

      <!-- Common options for all users -->
      <!-- <div class="border-t border-blue-100 my-1"></div>

      <button
        @click="handleReport"
        class="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center text-red-600 transition-colors duration-200"
      >
        <va-icon name="flag" color="#EF4444" class="mr-3" />
        <span>Báo cáo bài viết</span>
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isSaved: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "edit-post",
  "pin-post",
  "hide-post",
  "save-post",
  "hide-user",
  "delete-post",
  "report",
]);

const handleEditPost = () => {
  emit("edit-post", props.post.id);
};

const handlePinPost = () => {
  emit("pin-post", props.post.id);
};

const handleHidePost = () => {
  emit("hide-post", props.post.id);
};

const handleSavePost = () => {
  emit("save-post", props.post.id);
};

const handleHideUser = () => {
  emit("hide-user", props.post.author.id);
};

const handleDeletePost = () => {
  emit("delete-post", props.post.id);
};

const handleReport = () => {
  emit("report", props.post.id);
};
</script>
