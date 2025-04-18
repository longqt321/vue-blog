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
  router.push({ name: "profile", params: { id: 1 } });
};

const handleLogout = () => {
  if (props.onClose) props.onClose();
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="py-2">
    <button
      @click="goToProfile"
      class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
    >
      Trang cá nhân
    </button>

    <hr class="border-gray-200 my-1" />

    <button
      @click="handleLogout"
      class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
    >
      Đăng xuất
    </button>
  </div>
</template>
