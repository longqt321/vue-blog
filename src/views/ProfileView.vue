<script setup>
import { computed } from "vue";
import UserAvatar from "@/components/UserAvatar.vue";
import image from "@/assets/avatar.jpg";
import { useUserStore } from "@/stores/userStore";
import NavBar from "@/components/NavBar.vue";
import PostCreationModal from "@/components/PostCreationModal.vue";

const user = {
  id: 1,
  lastName: "Tran Duc",
  firstName: "Long",
  class: "23T_Nhat1",
  school: "University of Science and Technology",
  avatar: image,
};
</script>
<template>
  <NavBar />
  <PostCreationModal />
  <div class="bg-gray-400 w-full h-full flex justify-center">
    <div class="grid grid-cols-3 w-[80%] h-full bg-gray-500">
      <div class="col-span-1 bg-blue-400">
        <div
          class="sticky top-[64px] h-[calc(100vh-64px)] bg-blue-100 p-2 overflow-y-auto scrollbar-custom"
        >
          <div class="flex flex-col justify-around h-full p-1">
            <div class="flex flex-col w-full h-[30%] bg-blue-600 rounded-3xl">
              <div class="flex w-full h-[45%] mb-2">
                <div class="relative right-3 bottom-3 justify-center w-[40%]">
                  <UserAvatar
                    :src="user.avatar"
                    :alt="user.fisrtName"
                    size="lg"
                  />
                </div>
                <div class="flex w-[60%] mt-2 p-2 rounded-lg">
                  <div class="text-white">
                    <p class="font-bold">
                      Tran Duc Long
                      <span class="text-sm text-gray-300">#DLong2705</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col w-full h-[55%] rounded-lg p-3">
                <h4 class="font-medium text-white mb-2">Thông tin cá nhân</h4>
                <div class="text-sm text-gray-300">
                  <p class="mb-1">📍 Đà Nẵng, Việt Nam</p>
                  <p class="mb-1">🎓 Đại học Bách khoa</p>
                  <p class="mb-1">💼 Software Engineer</p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-center w-full h-[40%] bg-blue-600 rounded-3xl"
            ></div>
            <div
              class="flex justify-center w-full h-[25%] bg-blue-600 rounded-3xl"
            ></div>
          </div>
        </div>
      </div>
      <div class="col-span-2 bg-red-400"></div>
    </div>
  </div>
</template>
