<script setup>
import UserAvatar from "./UserAvatar.vue";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div class="flex w-full h-[45%] mb-2">
    <div class="sm:relative sm:right-3 sm:bottom-3 justify-center min-w-[40%]">
      <UserAvatar :src="user.avatar" :alt="user.firstName" :size="`xl`" />
    </div>
    <div class="flex w-[60%] mt-2 p-2 rounded-lg">
      <div class="text-white">
        <p class="font-bold">
          Tran Duc Long
          <span class="text-sm text-gray-300">#DLong2705</span>
        </p>
      </div>
    </div>
  </div>
  <div class="flex flex-col w-full h-[55%] rounded-lg p-3">
    <h4 class="font-medium text-white mb-2">Thông tin cá nhân</h4>
    <div class="text-md text-gray-300">
      <p class="mb-1">📍 Đà Nẵng, Việt Nam</p>
      <p class="mb-1">🎓 Đại học Bách khoa</p>
      <p class="mb-1">💼 Software Engineer</p>
    </div>
    <div class="">
      <span class="text-white font-bold text-lg">Description: </span>
      <span class="text-gray-300">I'm a software engineer</span>
    </div>
    <div class="flex justify-center">
      <button class="bg-blue-500 text-white px-4 py-1 rounded-lg mt-2">
        Chỉnh sửa thông tin
      </button>
    </div>
  </div>
</template>
