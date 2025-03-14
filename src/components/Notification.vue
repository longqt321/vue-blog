<script setup>
import { handleError } from "vue";

const props = defineProps({
  notification: Object,
});

const emit = defineEmits(["markAsRead"]);
const handleClick = () => {
  emit("markAsRead", props.notification.id);
};
</script>
<template>
  <div
    class="flex items-start p-4 hover:bg-gray-50 cursor-pointer"
    @click="handleClick"
    :class="{ 'bg-blue-50': !notification.read }"
  >
    <div class="flex-grow">
      <p class="text-sm" :class="{ 'font-medium': !notification.read }">
        {{ notification.content }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        {{ notification.time }}
      </p>
    </div>
    <div
      v-if="!notification.read"
      class="h-2 w-2 bg-blue-500 rounded-full"
    ></div>
  </div>
</template>
