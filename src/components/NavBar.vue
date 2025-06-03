<template>
  <header
    class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md sticky top-0 z-50"
  >
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-3">
        <!-- Left side: Logo and brand name -->
        <div class="flex items-center space-x-3">
          <router-link to="/" class="flex items-center space-x-2">
            <va-icon
              name="article"
              size="large"
              color="#FFFFFF"
              class="p-1 rounded-md"
            />
            <span class="text-xl font-bold">BlogShare</span>
          </router-link>
        </div>

        <!-- Right side: User controls -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <ThemeToggle />
          <!-- Notification Bell -->
          <div class="relative">
            <button
              @click="toggleNotifDropdown"
              class="p-2.5 rounded-full hover:bg-blue-600 transition duration-200"
              :title="notificationTitle"
            >
              <va-icon
                name="notifications"
                color="#FFFFFF"
                size="large"
                class="font-bold"
              />
              <div
                v-if="notifications.filter((n) => !n.read).length > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ notifications.filter((n) => !n.read).length }}
              </div>
            </button>

            <!-- Notification Dropdown -->
            <BaseDropdown v-if="showNotifDropdown">
              <NotificationContent />
            </BaseDropdown>
          </div>

          <!-- User Avatar -->
          <div class="relative">
            <button
              @click="toggleAvatarDropdown"
              class="flex items-center hover:bg-blue-600 rounded-md space-x-2 focus:outline-none"
            >
              <div
                class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0 mr-2"
              >
                <DynamicImage
                  :imageId="authStore.getUser.avatarId"
                  :alt="avatar"
                  container-class="w-full h-full"
                  image-class="w-full h-full object-cover"
                  loading-size="20px"
                  placeholder-icon-size="medium"
                  error-icon-size="medium"
                />
              </div>
              <span class="hidden md:block font-medium">Profile</span>
              <va-icon
                name="expand_more"
                color="#FFFFFF"
                size="medium"
                class="font-bol p-0.5 rounded"
              />
            </button>

            <!-- Avatar Dropdown -->
            <BaseDropdown v-if="showAvatarDropdown">
              <AvatarDropdownContent :onClose="toggleAvatarDropdown" />
            </BaseDropdown>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useNotifStore } from "@/stores/notifStore";
import { useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blogStore";
import NotificationContent from "./NotificationContent.vue";
import BaseDropdown from "./BaseDropdown.vue";
import AvatarDropdownContent from "./AvatarDropdownContent.vue";
import { useAuthStore } from "@/stores/authStore";
import DynamicImage from "./DynamicImage.vue";

const router = useRouter();
const notifStore = useNotifStore();
const blogStore = useBlogStore();
const authStore = useAuthStore();

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

const openModal = () => {
  blogStore.openModal();
};

const notifications = computed(() => notifStore.getNotifs);
const unReadCount = computed(() => notifStore.getUnreadCount);
const notificationTitle = computed(() => notifStore.getNotificationTitle);
</script>
