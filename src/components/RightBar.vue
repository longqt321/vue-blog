<script setup>
import Friend from "./Friend.vue";
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import userService from "@/services/userService";
import SearchBar from "./SearchBar.vue";

const userStore = useUserStore();
const userSearch = ref("");
const isLoading = computed(() => userStore.isSuggestedUsersLoading);

const suggestedUsers = computed(() => userStore.getSuggestedUsers);
const moreSuggestedUsersAvailable = computed(
  () => userStore.moreSuggestedUsersAvailable
);

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
      <SearchBar
        v-model="userSearch"
        placeholder="Tìm kiếm người dùng theo tên hoặc tên đăng nhập..."
      />
    </div>

    <!-- Online Friends Section -->
    <div class="p-4 border-b border-blue-50">
      <h3 class="font-medium text-blue-800 mb-3">Người dùng phổ biến</h3>
      <div class="max-h-64 overflow-y-auto scrollbar-custom space-y-2">
        <!-- Loading State -->
        <VaInfiniteScroll
          :load="loadMoreSuggestedUser"
          :disabled="!moreSuggestedUsersAvailable"
        >
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
