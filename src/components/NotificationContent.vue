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
  <div>
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex justify-between items-center"
    >
      <h3 class="font-bold text-lg">Thông báo</h3>
      <button
        @click="markAllAsRead"
        class="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center"
      >
        <va-icon name="done_all" size="small" class="mr-1" />
        Đánh dấu tất cả đã đọc
      </button>
    </div>

    <!-- Notification List -->
    <div class="max-h-[350px] overflow-y-auto scrollbar-custom">
      <div
        v-if="notifications.length === 0"
        class="p-6 text-center text-gray-500"
      >
        <va-icon name="notifications_off" size="large" color="#3B82F6" />
        <p class="mt-2">Không có thông báo</p>
      </div>

      <div v-else>
        <div v-for="notification in notifications" :key="notification.id">
          <Notification :notification="notification" @markAsRead="markAsRead" />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-3 bg-blue-50 text-center border-t border-blue-100">
      <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
        Xem tất cả thông báo
      </button>
    </div>
  </div>
</template>
