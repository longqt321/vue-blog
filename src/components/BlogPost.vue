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
            {{ post.author?.fullName }}
          </h3>
        </div>
      </div>

      <div class="flex space-x-1">
        <va-button
          icon="more_horiz"
          round
          size="small"
          color="#f0f4f9"
          text-color="#4B5563"
          class="hover:bg-blue-50"
        />
        <va-button
          icon="close"
          round
          size="small"
          color="#f0f4f9"
          text-color="#4B5563"
          class="hover:bg-blue-50"
          @click="handleHide"
        />
      </div>
    </div>

    <!-- Nội dung bài viết -->
    <div class="p-5">
      <h2 class="text-xl text-center font-bold text-blue-900 mb-3">
        {{ post.title }}
      </h2>

      <div
        ref="contentRef"
        :class="[
          'transition-all duration-300 overflow-hidden relative',
          !expanded && contentTooLong ? 'max-h-[300px]' : 'max-h-full',
        ]"
      >
        <MdPreview :model-value="post.content" class="prose max-w-none" />
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
    <div class="text-xs text-gray-400 px-5 pb-3">{{ post.createdAt }}</div>

    <!-- Actions -->
    <div class="border-t border-blue-50 p-3 bg-blue-50 flex justify-between">
      <div class="flex space-x-4">
        <button class="flex items-center text-gray-600 hover:text-blue-600">
          <va-icon name="thumb_up" />
          <span class="ml-1 text-sm">Like</span>
        </button>
        <button class="flex items-center text-gray-600 hover:text-blue-600">
          <va-icon name="comment" />
          <span class="ml-1 text-sm">Comment</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const blogStore = useBlogStore();
const handleHide = () => blogStore.hidePost(props.post.id);

const contentRef = ref(null);
const contentTooLong = ref(false);
const expanded = ref(false);

onMounted(async () => {
  await nextTick();
  if (contentRef.value && contentRef.value.scrollHeight > 320) {
    contentTooLong.value = true;
  }
});
</script>
