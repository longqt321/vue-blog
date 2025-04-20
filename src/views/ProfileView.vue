<template>
  <div class="bg-blue-50 min-h-screen">
    <NavBar />

    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left sidebar - Fixed Profile Info -->
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
                  :src="user.avatar || '../assets/avatar.jpg'"
                  alt="Profile picture"
                  class="w-full h-full object-cover"
                />
              </div>

              <h1 class="text-xl font-bold text-blue-900 text-center">
                {{ user.fullName }}
              </h1>
              <p class="text-gray-500 text-center">@{{ user.username }}</p>

              <!-- Action Buttons -->
              <div class="w-full mt-4 space-y-2">
                <!-- If viewing own profile -->
                <va-button
                  v-if="isCurrentUser"
                  color="primary"
                  icon="edit"
                  class="w-full"
                >
                  Edit Profile
                </va-button>

                <!-- If viewing someone else's profile -->
                <template v-else>
                  <va-button
                    color="primary"
                    icon="add"
                    class="w-full"
                    v-if="!isFollowing"
                    @click="toggleFollow"
                  >
                    Follow
                  </va-button>
                  <va-button
                    outlined
                    color="primary"
                    class="w-full"
                    v-else
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

            <!-- Profile Stats -->
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

            <!-- Bio and Personal Info -->
            <div class="py-4 px-6">
              <h3 class="font-medium text-gray-700 mb-2">Bio</h3>
              <p class="text-gray-600 text-sm mb-4">
                {{ user.bio || "No bio provided yet." }}
              </p>

              <div class="space-y-3 text-sm">
                <div
                  class="flex items-center text-gray-600"
                  v-if="user.location"
                >
                  <va-icon
                    name="place"
                    size="small"
                    class="text-blue-500 mr-2"
                  />
                  <span>{{ user.location }}</span>
                </div>
                <div class="flex items-center text-gray-600" v-if="user.school">
                  <va-icon
                    name="school"
                    size="small"
                    class="text-blue-500 mr-2"
                  />
                  <span>{{ user.school }}</span>
                </div>
                <div class="flex items-center text-gray-600" v-if="user.class">
                  <va-icon
                    name="groups"
                    size="small"
                    class="text-blue-500 mr-2"
                  />
                  <span>{{ user.class }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <va-icon
                    name="date_range"
                    size="small"
                    class="text-blue-500 mr-2"
                  />
                  <span>Joined April 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Scrollable Blog Posts -->
        <div class="md:w-2/3 lg:w-3/4">
          <!-- Tab Navigation -->
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
              v-else-if="userPosts.length === 0"
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

            <!-- Blog Posts with Actions Based on Viewer -->
            <div v-for="post in userPosts" :key="post.id" class="relative">
              <!-- Post Actions for Own Profile -->
              <div
                v-if="isCurrentUser"
                class="absolute top-3 right-3 flex space-x-2 z-10"
              >
                <va-dropdown :distance="4" position="bottom-end">
                  <template #anchor>
                    <va-button
                      icon="more_horiz"
                      size="small"
                      flat
                      round
                      color="gray"
                    />
                  </template>
                  <va-dropdown-content class="py-1">
                    <va-list-item @click="editPost(post.id)">
                      <va-icon name="edit" class="mr-2" />
                      Edit
                    </va-list-item>
                    <va-list-item @click="toggleVisibility(post.id)">
                      <va-icon name="visibility_off" class="mr-2" />
                      {{ post.isPrivate ? "Make Public" : "Make Private" }}
                    </va-list-item>
                    <va-list-item
                      @click="deletePost(post.id)"
                      class="text-danger"
                    >
                      <va-icon name="delete" class="mr-2" />
                      Delete
                    </va-list-item>
                  </va-dropdown-content>
                </va-dropdown>

                <va-badge color="blue" v-if="post.isPrivate" text="Private" />
              </div>

              <BlogPost :post="post" />
            </div>
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useBlogStore } from "@/stores/blogStore";
import NavBar from "@/components/NavBar.vue";
import BlogPost from "@/components/BlogPost.vue";
import PostCreationModal from "@/components/PostCreationModal.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const blogStore = useBlogStore();

const isLoading = ref(true);
const activeTab = ref("posts");
const isFollowing = ref(false);

// Tabs for the profile
const tabs = [
  { id: "posts", name: "Posts" },
  { id: "saved", name: "Saved" },
];

// Mock user data - in a real app, this would come from an API
const user = computed(() => {
  return {
    id: parseInt(route.params.id) || authStore.user?.id,
    username: "johndoe",
    fullName: "John Doe",
    avatar: "../assets/avatar.jpg",
    bio: "Software engineer and tech enthusiast. Passionate about building products that make a difference.",
    location: "Da Nang, Vietnam",
    school: "Da Nang University of Technology",
    class: "Computer Science",
    education: [
      {
        school: "Da Nang University of Technology",
        degree: "Bachelor of Computer Science",
        years: "2020 - 2024",
      },
    ],
    work: [
      {
        company: "Tech Solutions Inc.",
        position: "Frontend Developer Intern",
        years: "2023 - Present",
      },
    ],
  };
});

// Check if the current user is viewing their own profile
const isCurrentUser = ref(true);

// Mock post data
const userPosts = computed(() => {
  // If not viewing own profile, filter out private posts
});

const savedPosts = computed(() => {
  // In a real app, this would be filtered posts saved by the user
});

// Function to open the create post modal
const openCreatePost = () => {};

// Function to edit a post
const editPost = (postId) => {};

// Function to toggle post visibility (private/public)
const toggleVisibility = (postId) => {};

// Function to delete a post
const deletePost = async (postId) => {};

const toggleFollow = () => {};

const blockUser = () => {};
</script>
