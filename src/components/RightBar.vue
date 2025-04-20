<script setup>
import Friend from "./Friend.vue";
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const friendSearch = ref("");
const isLoading = ref(false);

const friendList = computed(() => userStore.getUsers);

const filteredFriends = computed(() => []);
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 sticky top-20"
  >
    <!-- Header Section -->
    <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <h2 class="text-lg font-bold">Your Network</h2>
    </div>

    <!-- Search Friends Section -->
    <div class="p-4 border-b border-blue-50">
      <div class="relative">
        <input
          v-model="friendSearch"
          type="text"
          placeholder="Search friends..."
          class="w-full px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <va-icon
          name="search"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400"
        />
      </div>
    </div>

    <!-- Online Friends Section -->
    <div class="p-4 border-b border-blue-50">
      <h3 class="font-medium text-blue-800 mb-3">Online Friends</h3>
      <div class="max-h-64 overflow-y-auto scrollbar-custom space-y-2">
        <!-- Loading State -->
        <div v-if="isLoading" class="py-2 text-center">
          <va-progress-circle indeterminate color="primary" size="small" />
        </div>

        <!-- No Friends State -->
        <div
          v-else-if="filteredFriends.length === 0"
          class="text-center py-4 text-gray-500"
        >
          <va-icon name="people_alt" size="large" color="#4285F4" />
          <p class="mt-2">No friends found</p>
        </div>

        <!-- Friends List -->
        <Friend
          v-else
          v-for="friend in filteredFriends"
          :key="friend.id"
          :friend="friend"
          class="hover:bg-blue-50 transition duration-200 rounded-lg"
        />
      </div>
    </div>

    <!-- Suggested Connections Section -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium text-blue-800">Suggested Connections</h3>
        <button class="text-xs text-blue-600 hover:underline">See All</button>
      </div>

      <div class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center"
            >
              <va-icon name="person" />
            </div>
            <div class="ml-3">
              <div class="font-medium text-sm">Suggested User {{ i }}</div>
              <div class="text-xs text-gray-500">DUT University</div>
            </div>
          </div>
          <va-button size="small" color="primary" icon="add" text
            >Connect</va-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
