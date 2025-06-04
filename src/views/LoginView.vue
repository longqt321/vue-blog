<template>
  <div
    class="bg-gradient-to-b from-blue-100 to-white min-h-screen w-full flex justify-center items-center py-8"
  >
    <div
      class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-blue-100"
    >
      <!-- Form Header with Logo -->
      <div class="mb-8 text-center">
        <div class="flex justify-center mb-4">
          <div
            class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <va-icon name="article" size="large" color="white" />
          </div>
        </div>
        <h2 class="text-2xl font-bold text-blue-800">Đăng Nhập</h2>
        <p class="text-gray-500 mt-2">Chào mừng trở lại với Blog App</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Username Field -->
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-blue-800 mb-1"
          >
            Tên đăng nhập <span class="text-red-500">*</span>
          </label>
          <va-input
            id="username"
            v-model="formData.username"
            placeholder="Nhập tên đăng nhập"
            class="w-full"
            color="primary"
            :error="!!errors.username"
            :error-messages="errors.username"
            prepend-inner-icon="person"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-blue-800 mb-1"
          >
            Mật khẩu <span class="text-red-500">*</span>
          </label>
          <va-input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Nhập mật khẩu"
            class="w-full"
            color="primary"
            :error="!!errors.password"
            :error-messages="errors.password"
            prepend-inner-icon="lock"
          />
        </div>
        <!-- Remember me and Forgot password -->
        <div class="flex justify-between items-center">
          <router-link
            to="/reset-password"
            class="text-sm text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </router-link>
        </div>

        <!-- Error Message Display -->
        <va-alert
          v-if="errorMessage"
          color="danger"
          icon="error"
          bordered
          class="my-4"
        >
          {{ errorMessage }}
        </va-alert>

        <!-- Submit Button -->
        <div class="pt-2">
          <va-button
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full"
            size="large"
            color="primary"
          >
            Đăng Nhập
          </va-button>
        </div>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <router-link
              to="/register"
              class="font-medium text-blue-600 hover:text-blue-800"
            >
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/authService";

const router = useRouter();
const authStore = useAuthStore();

// Form data
const formData = ref({
  username: "",
  password: "",
});
// Validation
const errors = ref({});
const errorMessage = ref("");
const isLoading = ref(false);

const validateForm = () => {
  errors.value = {};

  if (!formData.value.username) {
    errors.value.username = "Tên đăng nhập không được để trống";
  }

  if (!formData.value.password) {
    errors.value.password = "Mật khẩu không được để trống";
  }

  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await authService.login(formData.value);
    console.log(response);
    authStore.setAuth(response);
    router.push("/");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = "Sai tên đăng nhập hoặc mật khẩu";
    } else {
      errorMessage.value = "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
