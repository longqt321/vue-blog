<template>
  <div class="py-4">
    <!-- User Info Section -->
    <div class="flex items-center p-4 border-b border-blue-100">
      <div class="relative w-14 h-14">
        <img
          src="../assets/avatar.jpg"
          class="w-full h-full rounded-full border-2 border-blue-200"
          alt="Profile picture"
        />
        <div
          class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"
        ></div>
      </div>
      <div class="ml-3">
        <div class="font-bold text-blue-900">
          {{ authStore.getUser.fullName }}
        </div>
        <div class="text-sm text-gray-500">
          @{{ authStore.getUser.username }}
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="py-2">
      <!-- Profile -->
      <button
        @click="goToProfile"
        class="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
      >
        <va-icon name="person" color="#3B82F6" class="mr-3" />
        <span>Your Profile</span>
      </button>

      <!-- Saved Posts
      <button
        class="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
      >
        <va-icon name="bookmark" color="#3B82F6" class="mr-3" />
        <span>Saved Posts</span>
      </button>

      Settings
      <button
        class="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center text-gray-700 transition-colors duration-200"
      >
        <va-icon name="settings" color="#3B82F6" class="mr-3" />
        <span>Settings</span>
      </button> -->

      <hr class="my-2 border-blue-100" />

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center text-red-600 transition-colors duration-200"
      >
        <va-icon name="logout" color="#EF4444" class="mr-3" />
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
  onClose: Function,
});

const goToProfile = () => {
  if (props.onClose) props.onClose();
  router.push({ name: "profile", params: { id: authStore.getUser.id } });
};

const handleLogout = () => {
  if (props.onClose) props.onClose();
  authStore.logout();
  router.push("/login");
};
</script>
