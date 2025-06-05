<script setup>
import { useRouter } from "vue-router";
import DynamicImage from "./DynamicImage.vue";

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToProfile = () => {
  router.push({ name: "profile", params: { id: props.friend.id } });
};
</script>

<template>
  <div
    class="friend-item flex items-center p-3 my-2 rounded-lg transition duration-200 cursor-pointer"
    @click="goToProfile"
  >
    <div
      class="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0 mr-2"
    >
      <DynamicImage
        :imageId="friend.avatarId"
        container-class="w-full h-full"
        image-class="w-full h-full object-cover"
        loading-size="20px"
        placeholder-icon-size="medium"
        error-icon-size="medium"
      />
    </div>
    <div class="flex-grow">
      <div class="font-medium text-blue-900">
        {{ friend.lastName + " " + friend.firstName }}
      </div>
      <div class="text-xs text-gray-500 flex items-center">
        @{{ friend.username }}
      </div>
    </div>
  </div>
</template>
