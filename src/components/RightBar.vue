<script setup>
import Friend from "./Friend.vue";
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import userService from "@/services/userService";

const userStore = useUserStore();
const userSearch = ref("");
const isLoading = computed(() => userStore.isSuggestedUsersLoading);

const suggestedUsers = computed(() => userStore.getSuggestedUsers);

const loadMoreSuggestedUser = async () => {
  console.log(
    "Loading more users from page:",
    userStore.getSuggestedUsersCurrentPage + 1
  );
  await userStore.loadMoreSuggestedUsers();
};

onMounted(async () => {
  if (!suggestedUsers.value.length) {
    await userStore.fetchSuggestedUsers(0);
  }
});
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 sticky top-20"
  >
    <!-- Header Section -->
    <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <h2 class="text-lg font-bold">Famous users</h2>
    </div>

    <!-- Search Friends Section -->
    <div class="p-4 border-b border-blue-50">
      <div class="relative">
        <input
          v-model="userSearch"
          type="text"
          placeholder="Search users..."
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
      <h3 class="font-medium text-blue-800 mb-3">Popular users</h3>
      <div class="max-h-64 overflow-y-auto scrollbar-custom space-y-2">
        <!-- Loading State -->
        <VaInfiniteScroll :load="loadMoreSuggestedUser">
          <div v-if="isLoading" class="py-2 text-center">
            <va-progress-circle indeterminate color="primary" size="small" />
          </div>

          <!-- No Friends State -->
          <div
            v-else-if="suggestedUsers.length === 0"
            class="text-center py-4 text-gray-500"
          >
            <va-icon name="people_alt" size="large" color="#4285F4" />
            <p class="mt-2">No users suggested</p>
          </div>

          <!-- Friends List -->

          <Friend
            v-else
            v-for="friend in suggestedUsers"
            :key="friend.id"
            :friend="friend"
            @click="console.log(123)"
            class="hover:bg-blue-50 transition duration-200 rounded-lg"
          />
        </VaInfiniteScroll>
      </div>
    </div>
  </div>
</template>
