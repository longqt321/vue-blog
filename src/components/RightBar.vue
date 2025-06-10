<script setup>
import Friend from "./Friend.vue";
import { ref, computed, onMounted, watch } from "vue";
import { debounce } from "lodash";
import { useUserStore } from "@/stores/userStore";
import userService from "@/services/userService";
import SearchBar from "./SearchBar.vue";

const userStore = useUserStore();
const searchQuery = ref("");
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

const performSearch = async (query) => {
  console.log("Searching for:", query);
  userStore.data.searchQuery = searchQuery.value;
  console.log("Search query set to:", userStore.data.searchQuery);
  await userStore.fetchSuggestedUsers();
};

const debouncedSearch = debounce(performSearch, 500);

watch(searchQuery, (newVal) => {
  debouncedSearch(newVal);
});

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
      <h2 class="text-lg font-bold">
        Những người dùng khác
        <span class="relative group">
          <va-icon
            name="help_outline"
            size="small"
            class="ml-1 cursor-pointer"
          />
          <div
            class="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-72 bg-white text-blue-900 text-sm rounded shadow-lg p-3 border border-blue-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
          >
            <div class="font-semibold mb-1">Hướng dẫn tìm kiếm:</div>
            <ul class="list-disc pl-5">
              <li>
                <b>@username</b> — Tìm theo tên đăng nhập. Ví dụ:
                <b>@longtran123</b>
              </li>
              <li>
                <b>Họ tên</b> — Tìm theo họ tên. Ví dụ: <b>Trần Đức Long</b>
              </li>
              <li>Lưu ý: Chỉ chấp nhận 1 tiêu chí đồng thời</li>
              <li>Ví dụ: <b>@longtran123 hoặc Tran Duc Long</b></li>
            </ul>
          </div>
        </span>
      </h2>
    </div>
    <!-- Search Friends Section -->
    <div class="p-4 border-b border-blue-50">
      <SearchBar
        v-model="searchQuery"
        placeholder="Tìm kiếm người dùng theo tên hoặc tên đăng nhập..."
      />
    </div>

    <!-- Online Friends Section -->
    <div class="p-4 border-b border-blue-50">
      <div class="max-h-64 overflow-y-auto scrollbar-custom space-y-2">
        <!-- Loading State -->
        <VaInfiniteScroll
          :load="loadMoreSuggestedUser"
          :disabled="isLoading || !moreSuggestedUsersAvailable"
          :offset="100"
          :debounce="250"
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
            <p class="mt-2">Không có người dùng được gợi ý</p>
          </div>

          <!-- Friends List -->

          <Friend
            v-else
            v-for="friend in suggestedUsers"
            :key="friend.id"
            :friend="friend"
            class="hover:bg-blue-50 transition duration-200 rounded-lg"
          />
        </VaInfiniteScroll>
      </div>
    </div>
  </div>
</template>
