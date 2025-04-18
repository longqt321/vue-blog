<script setup>
import { ref, computed } from "vue";
import Notification from "./Notification.vue";
import { useNotifStore } from "@/stores/notifStore";
import { useRouter } from "vue-router";
import NotificationContent from "./NotificationContent.vue";
import BaseDropdown from "./BaseDropdown.vue";
import AvatarDropdownContent from "./AvatarDropdownContent.vue";

const router = useRouter();
const notifStore = useNotifStore();
const showNotifDropdown = ref(false);
const showAvatarDropdown = ref(false);

const toggleNotifDropdown = () => {
  showNotifDropdown.value = !showNotifDropdown.value;
  if (showNotifDropdown.value) {
    showAvatarDropdown.value = false;
  }
};

const toggleAvatarDropdown = () => {
  showAvatarDropdown.value = !showAvatarDropdown.value;
  if (showAvatarDropdown.value) {
    showNotifDropdown.value = false;
  }
};

const notifications = computed(() => notifStore.getNotifs);
const unReadCount = computed(() => notifStore.getUnreadCount);
const notificationTitle = computed(() => notifStore.getNotificationTitle);

const goToProfile = () => {
  //router.push({ name: "profile", params: { id: 1 } });
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
          @click="toggleNotifDropdown"
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
        <BaseDropdown v-if="showNotifDropdown">
          <NotificationContent />
        </BaseDropdown>
      </div>

      <div class="relative">
        <img
          src="../assets/avatar.jpg"
          class="w-12 h-12 rounded-full cursor-pointer"
          title="Tran Duc Long"
          alt="Avatar"
          @click="toggleAvatarDropdown"
        />
        <BaseDropdown v-if="showAvatarDropdown">
          <AvatarDropdownContent />
        </BaseDropdown>
      </div>
    </div>
  </header>
</template>
