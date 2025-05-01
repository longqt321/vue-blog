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
      <div
        class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"
      ></div>
    </div>
    <div class="flex-grow">
      <div class="font-medium text-blue-900">
        {{ friend.lastName + " " + friend.firstName }}
      </div>
      <div class="text-xs text-gray-500 flex items-center">
        <va-icon name="circle" size="xx-small" class="mr-1 text-green-500" />
        Online
      </div>
    </div>
    <va-button
      text
      color="primary"
      size="small"
      icon="message"
      class="flex-shrink-0"
    />
  </div>
</template>
