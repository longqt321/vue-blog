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
                  <va-button
                    v-if="!isFollowing"
                    color="primary"
                    icon="add"
                    class="w-full"
                    @click="toggleFollow"
                  >
                    Follow
                  </va-button>
                  <va-button
                    v-else
                    outlined
                    color="primary"
                    class="w-full"
                    @click="toggleFollow"
                  >
                    Following
                  </va-button>
                  <va-button
                    outlined
                    color="danger"
                    icon="block"
                    class="w-full mt-2"
                    @click="blockUser"
                  >
                    Block
                  </va-button>
                </template>
              </div>
            </div>

            <!-- Stats -->
            <div class="py-4 px-6 border-b border-blue-100">
              <div class="flex justify-between text-center">
                <div>
                  <div class="text-lg font-bold text-blue-800">238</div>
                  <div class="text-xs text-gray-500">Posts</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-blue-800">1,432</div>
                  <div class="text-xs text-gray-500">Followers</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-blue-800">847</div>
                  <div class="text-xs text-gray-500">Following</div>
                </div>
              </div>
            </div>

            <!-- Bio -->
            <div class="py-4 px-6">
              <h3 class="font-medium text-gray-700 mb-2">Bio</h3>
              <p class="text-gray-600 text-sm mb-4">
                {{ profileUser.bio || "No bio provided yet." }}
              </p>

              <div class="space-y-3 text-sm">
                <div
                  class="flex items-center text-gray-600"
                  v-if="profileUser.organisation || 1 == 1"
                >
                  <va-icon
                    name="groups"
                    size="small"
                    class="text-blue-500 mr-2"
                  />
                  <span>{{ profileUser.organisation }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <va-icon
                    name="date_range"
                    size="small"
                    class="text-blue-500 mr-2"
                  />
                  <span>Tạo lúc: {{ formatTime(profileUser.createdAt) }}</span>
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
          <div class="card bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div class="p-5">
              <h2 class="text-xl font-bold text-blue-800 mb-4">
                Create New Post
              </h2>
              <CreatePostArea />
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
              <va-icon name="article_off" size="large" color="#3B82F6" />
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
              <va-button
                v-if="isCurrentUser"
                color="primary"
                class="mt-6"
                @click="openCreatePost"
              >
                Create Your First Post
              </va-button>
            </div>

            <BlogPost v-for="post in userPosts" :key="post.id" :post="post" />
          </div>

          <div v-if="activeTab === 'saved'" class="space-y-6">
            <BlogPost v-for="post in savedPosts" :key="post.id" :post="post" />
          </div>
        </div>
      </div>
    </div>

    <PostCreationModal />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useBlogStore } from "@/stores/blogStore";
import NavBar from "@/components/NavBar.vue";
import BlogPost from "@/components/BlogPost.vue";
import PostCreationModal from "@/components/PostCreationModal.vue";
import userService from "@/services/userService";
import { normalizeUser } from "@/composables/userFormater";
import { formatTime } from "@/composables/timeFormatter";
import CreatePostArea from "@/components/CreatePostArea.vue";

const authStore = useAuthStore();
const blogStore = useBlogStore();
const route = useRoute();
const router = useRouter();

// State
const activeTab = ref("posts");
const isFollowing = ref(false); // To be implemented with real data
const profileUser = ref(null);
const savedPosts = ref([]); // To be implemented with real saved posts

// Computed properties
const isLoading = computed(() => blogStore.isPostsLoading);
const error = computed(() => blogStore.getError);
const userPosts = computed(() => blogStore.getPosts); // Use the single posts array
const currentUser = computed(() => authStore.getUser);
const profileUserId = computed(() => profileUser.value?.id);
const hasNoPosts = computed(() => !blogStore.getPosts.length);
const isCurrentUser = computed(() => {
  return (
    currentUser.value?.id &&
    profileUserId.value &&
    currentUser.value.id === profileUserId.value
  );
});

// Fetch user profile and their posts
const fetchProfileUser = async () => {
  try {
    const response = await userService.getUserById(route.params.id);
    profileUser.value = normalizeUser(response);

    // Fetch posts for this user using the store
    if (profileUser.value?.id) {
      await blogStore.fetchProfilePosts(profileUser.value.id);
    }
  } catch (error) {
    console.error("Failed to fetch profile user", error);
  }
};

// Actions
const toggleFollow = async () => {
  // To be implemented with real follow/unfollow API
  isFollowing.value = !isFollowing.value;
  // API call would go here
};

const blockUser = async () => {
  // To be implemented with real block user API
  // API call would go here
};

const openCreatePost = () => {
  blogStore.openModal();
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

onMounted(async () => {
  await fetchProfileUser();
});

// Clean up when leaving the profile page
onBeforeUnmount(() => {
  // No need to explicitly clear posts as they'll be replaced
  // when navigating to another view
});
</script>
