<script setup>
import { ref, computed } from "vue";
import Notification from "./Notification.vue";
import { useNotifStore } from "@/stores/notifStore";
import { useRouter } from "vue-router";

const router = useRouter();
const notifStore = useNotifStore();
const showNotifDropDown = ref(false);

const toggleNotifications = () => {
  showNotifDropDown.value = !showNotifDropDown.value;
};

const markAsRead = (id) => {
  notifStore.markAsRead(id);
};

const markAllAsRead = () => {
  notifStore.markAllAsRead();
};
const notifications = computed(() => notifStore.getNotifs);
const unReadCount = computed(() => notifStore.getUnreadCount);
const notificationTitle = computed(() => notifStore.getNotificationTitle);

const goToProfile = () => {
  router.push({ name: "profile", params: { id: 1 } });
};
</script>

<template>
  <header
    class="flex justify-between items-center bg-[#4267b2] text-white p-2 sticky w-full top-0 z-10 border-black"
  >
    <div class="home">
      <h1>Nav bar</h1>
    </div>
    <div class="flex items-center space-x-4 pr-4">
      <div class="relative">
        <!-- Nút chuông thông báo -->
        <img
          src="../assets/bell-closed.svg"
          class="w-10 h-10 rounded-full cursor-pointer"
          alt="Notification"
          @click="toggleNotifications"
          :title="notificationTitle"
        />
        <!-- Badge hiển thị số thông báo chưa đọc -->
        <div
          v-if="notifications.filter((n) => !n.read).length > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {{ notifications.filter((n) => !n.read).length }}
        </div>

        <!-- Dropdown thông báo -->
        <div
          v-if="showNotifDropDown"
          class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 text-gray-800"
        >
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
              <Notification
                :notification="notification"
                @markAsRead="markAsRead"
              />
            </div>
          </div>

          <div class="p-3 bg-gray-100 text-center">
            <button
              class="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>
        </div>
      </div>

      <img
        src="../assets/avatar.jpg"
        class="w-12 h-12 rounded-full cursor-pointer"
        title="Tran Duc Long"
        alt="Avatar"
        @click="goToProfile"
      />
    </div>
  </header>
</template>
