<script setup>
const props = defineProps({
  friend: Object,
});
</script>

<template>
  <div
    class="friend-item flex items-center p-2 mt-4 bg-blue-200 rounded-4xl cursor-pointer"
  >
    <img
      class="rounded-full w-12.5 h-12.5 mx-0.5 mr-4"
      :src="friend.avatar"
      alt="Avatar"
      :title="friend.title"
    />
    <div class="username text-lg">
      {{ friend.lastName + " " + friend.firstName }}
    </div>
  </div>
</template>
