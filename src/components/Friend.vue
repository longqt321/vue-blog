<script setup>
import { useRouter } from "vue-router";

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
    <div class="relative w-12 h-12 flex-shrink-0 mr-3">
      <img
        class="rounded-full w-full h-full object-cover border-2 border-blue-100"
        :src="friend.avatar"
        alt="Avatar"
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
