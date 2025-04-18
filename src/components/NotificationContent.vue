<script setup>
import { computed } from "vue";
import { useNotifStore } from "@/stores/notifStore";
import Notification from "./Notification.vue";

const notifStore = useNotifStore();
const markAsRead = (id) => {
  notifStore.markAsRead(id);
};

const markAllAsRead = () => {
  notifStore.markAllAsRead();
};
const notifications = computed(() => notifStore.getNotifs);
const unReadCount = computed(() => notifStore.getUnreadCount);
const notificationTitle = computed(() => notifStore.getNotificationTitle);
</script>

<template>
  <div class="p-3 bg-gray-100 flex justify-between items-center">
    <h3 class="font-medium">Thông báo</h3>
    <button
      @click="markAllAsRead"
      class="text-sm text-blue-600 hover:underline cursor-pointer"
    >
      Đánh dấu đã đọc
    </button>
  </div>

  <div class="max-h-80 overflow-y-auto scrollbar-custom">
    <div
      v-if="notifications.length === 0"
      class="p-4 text-center text-gray-500"
    >
      Không có thông báo
    </div>

    <div v-for="notification in notifications" :key="notification.id">
      <Notification :notification="notification" @markAsRead="markAsRead" />
    </div>
  </div>

  <div class="p-3 bg-gray-100 text-center">
    <button class="text-sm text-blue-600 hover:underline cursor-pointer">
      Xem tất cả
    </button>
  </div>
</template>
