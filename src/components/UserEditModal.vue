<template>
  <va-modal v-model="isOpen" title="Chỉnh sửa hồ sơ" hide-default-actions>
    <div class="p-6">
      <!-- Avatar section -->
      <div class="flex flex-col items-center mb-8">
        <img
          :src="editForm.avatarUrl || defaultAvatar"
          alt="Ảnh đại diện"
          class="w-32 h-32 rounded-full object-cover border-2 border-gray-200 mb-4 shadow-sm"
        />
        <va-file-upload
          type="single"
          file-types="image/*"
          hide-file-list
          @change="handleAvatarUpload"
        >
          <va-button color="primary" class="rounded-lg px-5 py-2">
            <va-icon name="cloud_upload" class="mr-2" />
            Chọn ảnh mới
          </va-button>
        </va-file-upload>
      </div>

      <!-- Form fields container -->
      <div class="max-w-md mx-auto space-y-6">
        <!-- Input fields -->
        <va-input
          v-model="editForm.lastName"
          label="Họ"
          placeholder="Nhập họ"
          class="w-full"
          preset="bordered"
        />

        <va-input
          v-model="editForm.firstName"
          label="Tên"
          placeholder="Nhập tên"
          class="w-full"
          preset="bordered"
        />

        <!-- Description textarea -->
        <va-input
          v-model="editForm.description"
          type="textarea"
          label="Giới thiệu bản thân"
          placeholder="Bạn là ai, sở thích gì..."
          autosize
          :min-rows="4"
          class="w-full min-h-[120px]"
          preset="bordered"
        />
      </div>
    </div>

    <!-- Footer actions -->
    <template #footer>
      <div class="flex justify-end p-4 space-x-3 border-t border-gray-100">
        <va-button
          @click="closeModal"
          color="secondary"
          class="rounded-lg px-5 py-2"
          preset="plain"
        >
          Hủy bỏ
        </va-button>
        <va-button
          @click="submitEditProfile"
          color="primary"
          class="rounded-lg px-5 py-2"
        >
          <va-icon name="save" class="mr-2" />
          Lưu thay đổi
        </va-button>
      </div>
    </template>
  </va-modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useModalStore } from "@/stores/modalStore";
import userService from "@/services/userService";

const userStore = useUserStore();
const modalStore = useModalStore();
const isOpen = computed(() => modalStore.isUserEditOpen);

const defaultAvatar = "/assets/avatar.jpg";

const editForm = ref({
  lastName: "",
  firstName: "",
  description: "",
  avatarUrl: "", // Có thể là URL hoặc blob preview
});

// Gán dữ liệu khi mở modal
watch(isOpen, (open) => {
  if (open) {
    const user = userStore.profile;
    editForm.value.lastName = user.lastName || "";
    editForm.value.firstName = user.firstName || "";
    editForm.value.description = user.description || "";
    editForm.value.avatarUrl = user.avatarUrl || "";
  }
});

const closeModal = () => {
  modalStore.isUserEditOpen = false;
};

const handleAvatarUpload = (files) => {};

const submitEditProfile = async () => {
  // Gửi editForm lên server (gồm cả avatarFile nếu có)
  console.log("Dữ liệu gửi đi:", editForm.value);
  const updatedUser = userStore.profile;
  updatedUser.firstName = editForm.value.firstName;
  updatedUser.lastName = editForm.value.lastName;
  updatedUser.description = editForm.value.description;
  await userService.updateUser(updatedUser.id, updatedUser);
  closeModal();
};
</script>
