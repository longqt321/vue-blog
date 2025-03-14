<script setup>
const props = defineProps({
  post: {
    type: Object,
  },
});
</script>

<template>
  <div
    class="bg-white m-1 p-2 rounded-lg cursor-pointer shadow-sm hover:shadow-md"
  >
    <h3 class="font-bold text-lg mb-2">{{ post.title }}</h3>
    <div class="flex items-center mb-2 text-sm text-gray-600">
      <div
        class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2"
      >
        {{ post.author.firstName.charAt(0) }}
      </div>
      <div>
        <span class="font-medium">{{ post.author.fullName }}</span>
        <span class="mx-1">•</span>
        <span>{{ post.author.class }}</span>
      </div>
    </div>

    <!-- Institution with icon -->
    <div class="mb-3 text-xs text-gray-500 flex items-center">
      {{ post.author.school }}
    </div>
    <div class="flex flex-wrap mb-2">
      <span
        v-for="hashtag in post.hashtags"
        :key="hashtag"
        class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full mr-1 mb-1"
      >
        #{{ hashtag }}
      </span>
    </div>
    <div class="text-xs text-gray-400 flex items-center">
      {{ post.createdAt }}
    </div>
  </div>
</template>
