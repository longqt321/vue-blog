<script setup>
import { onMounted } from "vue";
import LeftBar from "../components/LeftBar.vue";
import MainBox from "../components/MainBox.vue";
import RightBar from "../components/RightBar.vue";
import NavBar from "@/components/NavBar.vue";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";

const userStore = useUserStore();
const authStore = useAuthStore();

// onMounted(async () => {
//   if (authStore.isAuthenticated) {
//     try {
//       await userStore.fetchUsers();
//     } catch (error) {
//       console.error("Failed to fetch users", error);
//     }
//   }
// });
</script>
<template>
  <NavBar />
  <div class="grid grid-cols-4 h-full">
    <!-- Leftbar: chiếm 1/4 chiều rộng -->
    <div class="col-span-1">
      <LeftBar />
    </div>

    <!-- MainBox: chiếm 2/4 chiều rộng -->
    <div class="col-span-2">
      <MainBox> </MainBox>
    </div>

    <!-- Rightbar: chiếm 1/4 chiều rộng -->
    <div class="col-span-1">
      <RightBar />
    </div>
  </div>
</template>
