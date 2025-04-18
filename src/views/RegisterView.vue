<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import authService from "@/services/authService";

const router = useRouter();

// Form data
const formData = ref({
  username: "",
  password: "",
  firstName: "",
  lastName: "",
});

// Validation
const errors = ref({});
const errorMessage = ref("");
const isSubmitting = ref(false);

const validateForm = () => {
  errors.value = {};

  if (!formData.value.username) {
    errors.value.username = "Tên đăng nhập không được để trống";
  } else if (formData.value.username.length < 4) {
    errors.value.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
  }

  if (!formData.value.password) {
    errors.value.password = "Mật khẩu không được để trống";
  } else if (formData.value.password.length < 6) {
    errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  if (!formData.value.firstName) {
    errors.value.firstName = "Tên không được để trống";
  }

  if (!formData.value.lastName) {
    errors.value.lastName = "Họ không được để trống";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const response = await authService.register(formData.value);
  } catch (error) {
    if (error.status === 409) {
      errorMessage.value = "This username already exists";
    } else {
      errorMessage.value = "Có lỗi xảy ra khi đăng ký";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div
    class="bg-gray-100 min-h-screen w-full flex justify-center items-center py-8"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <!-- Form Header -->
      <div class="mb-6 text-center">
        <h2 class="text-2xl font-bold text-gray-800">Đăng Ký Tài Khoản</h2>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            Tên đăng nhập <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.username }"
          />
          <p v-if="errors.username" class="mt-1 text-sm text-red-600">
            {{ errors.username }}
          </p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Mật khẩu <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Nhập mật khẩu"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- First Name & Last Name (side by side on larger screens) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name Field -->
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-700"
            >
              Tên <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              placeholder="Nhập tên"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
              {{ errors.firstName }}
            </p>
          </div>

          <!-- Last Name Field -->
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-700"
            >
              Họ <span class="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              placeholder="Nhập họ"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
              {{ errors.lastName }}
            </p>
          </div>
        </div>

        <!-- Error Message Display -->
        <div v-if="errorMessage" class="bg-red-50 p-4">
          <p class="text-sm text-red-700 text-center break-words">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
          >
            <span v-if="isSubmitting" class="flex flex-col items-center">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </span>
            <span v-else>Đăng Ký</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản?
            <router-link
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng nhập ngay
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
