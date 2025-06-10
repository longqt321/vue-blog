<template>
  <va-modal v-model="isOpen" title="Chỉnh sửa hồ sơ" hide-default-actions>
    <div class="p-6">
      <!-- Avatar section -->
      <div class="flex flex-col items-center mb-8">
        <DynamicImage
          :imageId="editForm.avatarId"
          alt="Ảnh đại diện"
          container-class="w-32 h-32 rounded-full border-2 border-gray-200 mb-4 shadow-sm overflow-hidden"
          image-class="w-full h-full object-cover"
          loading-text="Đang tải avatar..."
          error-text="Lỗi tải avatar"
          loading-size="24px"
        />
        <VaFileUpload
          type="single"
          file-types="image/*"
          dropzone
          hide-file-list
          @file-added="handleAvatarUpload"
          @file-removed="handleAvatarRemove"
          :disabled="uploadingAvatar"
          :loading="uploadingAvatar"
        >
          <template #dropzone>
            <div
              class="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              <va-icon
                name="cloud_upload"
                :size="48"
                color="primary"
                class="mb-2"
                v-if="!uploadingAvatar"
              />
              <va-progress-circle
                v-if="uploadingAvatar"
                :size="48"
                indeterminate
                color="primary"
                class="mb-2"
              />
              <p class="text-primary font-medium mb-1">
                {{
                  uploadingAvatar
                    ? "Đang tải lên..."
                    : "Kéo thả ảnh vào đây hoặc click để chọn"
                }}
              </p>
              <p class="text-gray-500 text-sm">
                Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 5MB)
              </p>
            </div>
          </template>
        </VaFileUpload>
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

        <va-input
          v-model="editForm.email"
          label="Email"
          placeholder="Nhập email"
          type="email"
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
          :disabled="updatingProfile"
        >
          Hủy bỏ
        </va-button>
        <va-button
          @click="submitEditProfile"
          color="primary"
          class="rounded-lg px-5 py-2"
          :loading="updatingProfile"
          :disabled="updatingProfile || uploadingAvatar"
        >
          <va-icon name="save" class="mr-2" v-if="!updatingProfile" />
          {{ updatingProfile ? "Đang lưu..." : "Lưu thay đổi" }}
        </va-button>
      </div>
    </template>
  </va-modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useModalStore } from "@/stores/modalStore";
import userService from "@/services/userService";
import imageService from "@/services/imageService";
import DynamicImage from "./DynamicImage.vue";
import { useUserStore } from "@/stores/userStore";

const authStore = useAuthStore();
const modalStore = useModalStore();
const userStore = useUserStore();
const isOpen = computed(() => modalStore.isUserEditOpen);

// Loading states
const uploadingAvatar = ref(false);
const updatingProfile = ref(false);

const editForm = ref({
  lastName: authStore.getUser.lastName || "",
  firstName: authStore.getUser.firstName || "",
  email: authStore.getUser.email || "",
  description: authStore.getUser.description || "",
  avatarId: authStore.getUser.avatarId || "",
});

// Gán dữ liệu khi mở modal
watch(isOpen, (open) => {
  if (open) {
    const user = authStore.getUser;
    editForm.value.lastName = user.lastName || "";
    editForm.value.firstName = user.firstName || "";
    editForm.value.email = user.email || "";
    editForm.value.description = user.description || "";
    editForm.value.avatarId = user.avatarId || "";
  }
});

const closeModal = () => {
  modalStore.isUserEditOpen = false;
};

const handleAvatarUpload = async (file) => {
  if (!file) {
    return;
  }

  try {
    uploadingAvatar.value = true;

    const actualFile = file[0];

    const imageId = await imageService.uploadAvatar(actualFile);
    editForm.value.avatarId = imageId;
  } catch (error) {
    console.error("Error uploading avatar:", error);
  } finally {
    uploadingAvatar.value = false;
  }
};

const submitEditProfile = async () => {
  try {
    updatingProfile.value = true; // Chuẩn bị dữ liệu cập nhật
    const updatedUser = {
      id: authStore.getUser.id,
      firstName: editForm.value.firstName,
      lastName: editForm.value.lastName,
      email: editForm.value.email,
      description: editForm.value.description,
    };

    // Chỉ thêm avatarId nếu có thay đổi
    if (
      editForm.value.avatarId &&
      editForm.value.avatarId !== authStore.getUser.avatarId
    ) {
      updatedUser.avatarId = editForm.value.avatarId;
    }

    // Gọi API cập nhật user
    const response = await userService.updateUser(updatedUser.id, updatedUser);
    authStore.setUser(response.data);
    closeModal();
    location.reload(); // Tải lại trang để cập nhật thông tin người dùng
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    updatingProfile.value = false;
  }
};
</script>
