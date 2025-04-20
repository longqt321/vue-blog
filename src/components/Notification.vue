<script setup>
const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["markAsRead"]);
const handleClick = () => {
  emit("markAsRead", props.notification.id);
};
</script>

<template>
  <div
    class="flex items-start p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-50"
    @click="handleClick"
    :class="{ 'bg-blue-50': !notification.read }"
  >
    <!-- Notification Icon -->
    <div class="mr-3 mt-1">
      <div
        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
      >
        <va-icon name="notifications" color="#3B82F6" size="small" />
      </div>
    </div>

    <!-- Notification Content -->
    <div class="flex-grow">
      <p
        class="text-sm text-gray-800"
        :class="{ 'font-medium': !notification.read }"
      >
        {{ notification.content }}
      </p>
      <div class="flex items-center mt-1">
        <va-icon name="schedule" size="xx-small" class="text-gray-400 mr-1" />
        <p class="text-xs text-gray-500">
          {{ notification.time }}
        </p>
      </div>
    </div>

    <!-- Unread Indicator -->
    <div
      v-if="!notification.read"
      class="h-2 w-2 bg-blue-500 rounded-full mt-2"
    ></div>
  </div>
</template>
