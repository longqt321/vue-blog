<template>
  <div class="bg-blue-50 min-h-screen">
    <NavBar />
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Leftbar: information and filters -->
        <div class="lg:col-span-1">
          <LeftBar />
        </div>

        <!-- MainBox: blog content -->
        <div class="lg:col-span-2">
          <MainBox />
        </div>

        <!-- Rightbar: friends and suggestions -->
        <div class="lg:col-span-1">
          <RightBar />
        </div>
      </div>
    </div>
    <PostCreationModal />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import LeftBar from "../components/LeftBar.vue";
import MainBox from "../components/MainBox.vue";
import RightBar from "../components/RightBar.vue";
import NavBar from "@/components/NavBar.vue";
import PostCreationModal from "@/components/PostCreationModal.vue";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useBlogStore } from "@/stores/blogStore";

const userStore = useUserStore();
const authStore = useAuthStore();
const blogStore = useBlogStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    console.log("Authenticated successfully!!");
    console.log(authStore.accessToken);
    blogStore.fetchPosts();
  }
});
</script>
