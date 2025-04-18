<script setup>
import Friend from "./Friend.vue";
import { ref, computed } from "vue";
import avatarImage from "../assets/avatar.jpg";
import SearchBar from "./SearchBar.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const searchQuery = ref("");

const friendList = computed(() => userStore.getUsers);
</script>

<template>
  <div
    class="sticky top-[64px] h-[calc(100vh-64px)] bg-blue-100 p-4 overflow-y-auto scrollbar-custom"
  >
    <div class="h-full">
      <SearchBar v-model="searchQuery" />
      <ul>
        <li v-for="friend in friendList" :key="friend.id">
          <Friend :friend="friend" />
        </li>
      </ul>
    </div>
  </div>
</template>
