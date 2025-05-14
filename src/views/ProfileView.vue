<template>
  <div class="bg-blue-50 min-h-screen">
    <NavBar />

    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left sidebar -->
        <div class="md:w-1/3 lg:w-1/4">
          <div
            class="bg-white rounded-xl shadow-sm border border-blue-100 sticky top-20"
          >
            <!-- Profile Photo -->
            <div
              class="flex flex-col items-center pt-6 pb-4 px-4 border-b border-blue-100"
            >
              <div
                class="w-32 h-32 rounded-full border-4 border-blue-100 overflow-hidden bg-white mb-4"
              >
                <img
                  :src="'../assets/avatar.jpg'"
                  alt="Profile picture"
                  class="w-full h-full object-cover"
                />
              </div>

              <h1 class="text-xl font-bold text-blue-900 text-center">
                {{ profileUser.fullName }}
              </h1>
              <p class="text-gray-500 text-center">
                @{{ profileUser.username }}
              </p>

              <!-- Action Buttons -->
              <div class="w-full mt-4 space-y-2">
                <va-button
                  v-if="isCurrentUser"
                  color="primary"
                  icon="edit"
                  class="w-full"
                >
                  Edit Profile
                </va-button>

                <template v-else>
                  <!-- Follow/Unfollow button -->
                  <va-button
                    v-if="userRelationship !== UserRelationship.BLOCKING"
                    :color="
                      userRelationship === UserRelationship.FOLLOWING
                        ? 'primary'
                        : 'primary'
                    "
                    :outlined="userRelationship === UserRelationship.FOLLOWING"
                    :icon="
                      userRelationship === UserRelationship.FOLLOWING
                        ? 'person'
                        : 'person_add'
                    "
                    class="w-full"
                    @click="toggleRelationship(UserRelationship.FOLLOWING)"
                  >
                    {{
                      userRelationship === UserRelationship.FOLLOWING
                        ? "Following"
                        : "Follow"
                    }}
                  </va-button>

                  <!-- Block/Unblock button -->
                  <va-button
                    :color="
                      userRelationship === UserRelationship.BLOCKING
                        ? 'primary'
                        : 'danger'
                    "
                    :outlined="userRelationship === UserRelationship.BLOCKING"
                    :icon="
                      userRelationship === UserRelationship.BLOCKING
                        ? 'person_add'
                        : 'block'
                    "
                    class="w-full mt-2"
                    @click="toggleRelationship(UserRelationship.BLOCKING)"
                  >
                    {{
                      userRelationship === UserRelationship.BLOCKING
                        ? "Unblock"
                        : "Block"
                    }}
                  </va-button>
                </template>
              </div>
            </div>

            <!-- Stats -->
            <div class="py-4 px-6 border-b border-blue-100">
              <div class="flex justify-between text-center">
                <div>
                  <div class="text-lg font-bold text-blue-800">
                    {{ profileUser.postCount }}
                  </div>
                  <div class="text-xs text-gray-500">Posts</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-blue-800">
                    {{ profileUser.followersCount }}
                  </div>
                  <div class="text-xs text-gray-500">Followers</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-blue-800">
                    {{ profileUser.followingCount }}
                  </div>
                  <div class="text-xs text-gray-500">Following</div>
                </div>
              </div>
            </div>

            <!-- Bio -->
            <div class="py-4 px-6">
              <h3 class="font-medium text-gray-700 mb-2">Description</h3>
              <p class="text-gray-600 text-sm mb-4">
                {{ profileUser.description || "No description provided yet." }}
              </p>

              <div class="space-y-3 text-sm">
                <div class="flex items-center text-gray-600">
                  <va-icon
                    name="date_range"
                    size="small"
                    class="text-blue-500 mr-2"
                  />
                  <span
                    >Tham gia lúc: {{ formatTime(profileUser.createdAt) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content -->
        <div class="md:w-2/3 lg:w-3/4">
          <!-- Tabs -->
          <div
            class="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 mb-6"
          >
            <div class="flex">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex-1 py-3 px-4 text-center font-medium transition-colors duration-200"
                :class="
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                "
              >
                {{ tab.name }}
              </button>
            </div>
          </div>
          <!-- Tab Content -->
          <div v-if="activeTab === 'posts'" class="space-y-6">
            <div v-if="isLoading" class="flex justify-center py-12">
              <va-progress-circle indeterminate color="primary" />
            </div>

            <div
              v-else-if="hasNoPosts"
              class="bg-white rounded-xl shadow-md p-8 text-center"
            >
              <h3 class="mt-4 text-xl font-medium text-gray-800">
                No posts yet
              </h3>
              <p class="mt-2 text-gray-500">
                {{
                  isCurrentUser
                    ? "Share your first post with the community!"
                    : "This user has not shared any posts yet."
                }}
              </p>
            </div>

            <BlogPost v-for="post in userPosts" :key="post.id" :post="post" />
          </div>

          <div v-if="activeTab === 'saved'" class="space-y-6">
            <div v-if="isLoading" class="flex justify-center py-12">
              <va-progress-circle indeterminate color="primary" />
            </div>

            <div
              v-else-if="hasNoPosts"
              class="bg-white rounded-xl shadow-md p-8 text-center"
            >
              <h3 class="mt-4 text-xl font-medium text-gray-800">
                No posts saved yet
              </h3>
              <p class="mt-2 text-gray-500">
                {{
                  isCurrentUser
                    ? "Save posts to read later"
                    : "This user has not saved any posts yet."
                }}
              </p>
            </div>
            <BlogPost v-for="post in savedPosts" :key="post.id" :post="post" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useBlogStore } from "@/stores/blogStore";
import { useUserStore } from "@/stores/userStore";
import NavBar from "@/components/NavBar.vue";
import BlogPost from "@/components/BlogPost.vue";
import PostCreationModal from "@/components/PostCreationModal.vue";
import userService from "@/services/userService";
import { normalizeUser } from "@/composables/userFormater";
import { formatTime } from "@/composables/timeFormatter";
import CreatePostArea from "@/components/CreatePostArea.vue";

// User relationship enum
const UserRelationship = Object.freeze({
  NONE: "NONE",
  FOLLOWING: "FOLLOWING",
  BLOCKING: "BLOCKING",
});

const authStore = useAuthStore();
const blogStore = useBlogStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// State
const activeTab = ref("posts");
const userRelationship = ref(UserRelationship.NONE);
const profileUser = ref(null);
const tabs = ref([
  { id: "posts", name: "Posts" },
  { id: "saved", name: "Saved" },
]);

// Computed properties
const isLoading = computed(() =>
  activeTab.value === "posts"
    ? userStore.isPersonalBlogsLoading
    : userStore.isSavedBlogsLoading
);
const error = computed(() =>
  activeTab.value === "posts"
    ? userStore.getPersonalBlogsError
    : userStore.getSavedBlogsError
);
const userPosts = computed(() => userStore.getPersonalBlogs);
const savedPosts = computed(() => userStore.getSavedBlogs);
const currentUser = computed(() => authStore.getUser);
const profileUserId = computed(() => profileUser.value?.id);
const hasNoPosts = computed(() =>
  activeTab.value === "posts"
    ? userPosts.value.length === 0
    : savedPosts.value.length === 0
);
const isCurrentUser = computed(() => {
  return (
    currentUser.value?.id &&
    profileUserId.value &&
    currentUser.value.id === profileUserId.value
  );
});

const toggleRelationship = async (type) => {
  try {
    if (!profileUserId.value) return;

    const targetId = profileUserId.value;

    // Nếu đang FOLLOWING mà bấm nữa thì hủy FOLLOW
    if (type === UserRelationship.FOLLOWING) {
      if (userRelationship.value === UserRelationship.FOLLOWING) {
        await userService.unfollowUser(targetId);
        userRelationship.value = UserRelationship.NONE;
        profileUser.value.followersCount -= 1;
      } else {
        await userService.followUser(targetId);
        userRelationship.value = UserRelationship.FOLLOWING;
        profileUser.value.followersCount += 1;
      }
    }

    // Nếu đang BLOCKING mà bấm nữa thì Unblock
    if (type === UserRelationship.BLOCKING) {
      if (userRelationship.value === UserRelationship.BLOCKING) {
        await userService.unblockUser(targetId);
        userRelationship.value = UserRelationship.NONE;
      } else {
        await userService.blockUser(targetId);
        userRelationship.value = UserRelationship.BLOCKING;
      }
    }
  } catch (error) {
    console.error("toggleRelationship failed:", error);
  }
};

// Fetch user profile and their posts
const fetchProfileUser = async () => {
  try {
    await userStore.fetchProfile(route.params.id);
    profileUser.value = userStore.getProfile;
    // Fetch posts for this user using the userStore with username
    if (profileUser.value?.username) {
      await userStore.fetchPersonalBlogs();

      // Only fetch saved blogs if viewing own profile
      if (isCurrentUser.value) {
        await userStore.fetchSavedBlogs();
      }
    }
  } catch (error) {
    console.error("Failed to fetch profile user", error);
  }
};
const fetchRelationshipStatus = async () => {
  const response = await userService.getRelationship(route.params.id);
  userRelationship.value = response.data;
};

// Handle tab changes
const handleTabChange = async (tabId) => {
  activeTab.value = tabId;

  if (
    tabId === "saved" &&
    isCurrentUser.value &&
    savedPosts.value.length === 0
  ) {
    //await userStore.fetchSavedBlogs();
  }
};

// Watchers and lifecycle hooks
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await fetchProfileUser();
    }
  },
  { immediate: true }
);

// Handle tab changes with watcher
watch(activeTab, handleTabChange);

onMounted(async () => {
  await fetchProfileUser();
  await fetchRelationshipStatus();
});

// Clean up when leaving the profile page
onBeforeUnmount(() => {
  // No explicit cleanup needed as we're using dedicated stores
});
</script>
