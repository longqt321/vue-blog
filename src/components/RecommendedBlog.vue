<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="bg-white p-4 rounded-lg shadow-sm border border-blue-100 transition-all duration-200 hover:shadow-md"
  >
    <div class="space-y-4">
      <!-- Post Title -->
      <h3 class="font-bold text-lg text-blue-800 line-clamp-2">
        {{ post.title }}
      </h3>

      <!-- Author Info -->
      <div class="flex items-center">
        <div
          class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-200"
        >
          <img
            v-if="post.author?.avatar"
            :src="post.author.avatar"
            class="w-full h-full object-cover"
            alt="Author avatar"
          />
          <va-icon v-else name="person" color="#3B82F6" />
        </div>
        <div class="ml-2">
          <div class="font-medium text-sm text-blue-900">
            {{ post.author?.fullName }}
          </div>
          <div class="text-xs text-gray-500">{{ post.author?.class }}</div>
        </div>
      </div>

      <!-- Institution -->
      <div class="text-xs text-gray-500 flex items-center">
        <va-icon name="school" size="small" class="mr-1" />
        {{ post.author?.school }}
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1">
        <span
          v-for="hashtag in post.hashtags?.slice(0, 3)"
          :key="hashtag"
          class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
        >
          #{{ hashtag }}
        </span>
        <span v-if="post.hashtags?.length > 3" class="text-xs text-blue-500"
          >+{{ post.hashtags.length - 3 }} more</span
        >
      </div>

      <!-- Post Date -->
      <div class="text-xs text-gray-400 flex items-center">
        <va-icon name="schedule" size="x-small" class="mr-1" />
        {{ post.createdAt }}
      </div>
    </div>
  </div>
</template>
