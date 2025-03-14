<script setup>
import RoundButton from "./RoundButton.vue";
import { useBlogStore } from "@/stores/blogStore";
const props = defineProps({
  post: {
    type: Object,
  },
});

const blogStore = useBlogStore();

const handleHide = () => {
  blogStore.hidePost(props.post.id);
};
</script>
<template>
  <div class="bg-gray-50 mt-4 p-4 rounded-2xl border border-gray-200">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-start">
        <img
          src="../assets/avatar.jpg"
          class="w-20 h-20 rounded-full cursor-pointer"
          alt="Avatar"
        />
        <div class="ml-2">
          <span class="block font-semibold">{{ post.author.fullName }}</span>
          <span class="block text-sm">{{ post.author.class }}</span>
          <span class="block text-sm">{{ post.author.school }}</span>
        </div>
      </div>
      <div class="flex">
        <RoundButton icon="fa-solid fa-ellipsis" />
        <RoundButton @click="handleHide" icon="fa-solid fa-xmark" />
      </div>
    </div>
    <h1 class="text-center text-3xl mb-2">{{ post.title }}</h1>
    <div class="mb-4 text-lg">
      {{ post.content }}
    </div>
    <div class="flex justify-between">
      <div class="text-sm italic text-gray-500">
        <span v-for="hashtag in post.hashtags" :key="hashtag" class="mr-2"
          >#{{ hashtag }}</span
        >
      </div>
      <div class="text-sm italic text-gray-500">
        {{ post.createdAt }}
      </div>
    </div>
  </div>
</template>
