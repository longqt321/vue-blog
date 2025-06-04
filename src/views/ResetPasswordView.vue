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
            <va-icon name="lock_reset" size="large" color="white" />
          </div>
        </div>
        <h2 class="text-2xl font-bold text-blue-800">Đặt Lại Mật Khẩu</h2>
      </div>
      <!-- Reset Password Form -->
      <form @submit.prevent="handleResetPassword" class="space-y-5">
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
        </div>        <!-- OTP Field -->
        <div>
          <label
            for="otp"
            class="block text-sm font-medium text-blue-800 mb-1"
          >
            Mã xác thực OTP <span class="text-red-500">*</span>
          </label>
          <div class="flex items-start gap-2">
            <div class="flex-1">
              <va-input
                id="otp"
                v-model="formData.otp"
                placeholder="Nhập mã OTP"
                class="w-full"
                color="primary"
                :error="!!errors.otp"
                :error-messages="errors.otp"
                prepend-inner-icon="verified_user"
              />
            </div>
            <va-button
              type="button"
              color="primary"
              class="flex-shrink-0 h-[40px]"
              @click="handleSendOtp"
              :loading="isSendingOtp"
              :disabled="isSendingOtp || otpCountdown > 0"
            >
              {{ otpCountdown > 0 ? `${otpCountdown}s` : "Gửi OTP" }}
            </va-button>
          </div>
        </div>

        <!-- New Password Field -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-blue-800 mb-1"
          >
            Mật khẩu mới <span class="text-red-500">*</span>
          </label>
          <va-input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Nhập mật khẩu mới"
            class="w-full"
            color="primary"
            :error="!!errors.password"
            :error-messages="errors.password"
            prepend-inner-icon="lock"
          />
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-blue-800 mb-1"
          >
            Xác nhận mật khẩu mới <span class="text-red-500">*</span>
          </label>
          <va-input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            class="w-full"
            color="primary"
            :error="!!errors.confirmPassword"
            :error-messages="errors.confirmPassword"
            prepend-inner-icon="lock"
          />
        </div>
        <!-- Error Message Display -->
        <va-alert
          v-if="errorMessage"
          color="danger"
          icon="error"
          bordered
          class="mb-4"
        >
          {{ errorMessage }}
        </va-alert>

        <!-- Success Message Display -->
        <va-alert
          v-if="successMessage"
          color="success"
          icon="check_circle"
          bordered
          class="mb-4"
        >
          {{ successMessage }}
        </va-alert>

        <!-- Submit Button -->
        <div class="pt-4">
          <va-button
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full"
            size="large"
            color="primary"
          >
            Đặt Lại Mật Khẩu
          </va-button>
        </div>

        <!-- Back to Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Nhớ mật khẩu rồi?
            <router-link
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-800"
            >
              Đăng nhập ngay
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
import authService from "@/services/authService";

const router = useRouter();

// Form data
const formData = ref({
  username: "",
  otp: "",
  password: "",
  confirmPassword: "",
});

// State management
const errors = ref({});
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);
const isSendingOtp = ref(false);
const otpCountdown = ref(0);

// Form validation
const validateForm = () => {
  errors.value = {};

  if (!formData.value.username) {
    errors.value.username = "Tên đăng nhập không được để trống";
  } else if (formData.value.username.length < 3) {
    errors.value.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
  }

  if (!formData.value.otp) {
    errors.value.otp = "Mã OTP không được để trống";
  }

  if (!formData.value.password) {
    errors.value.password = "Mật khẩu mới không được để trống";
  } else if (formData.value.password.length < 6) {
    errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = "Xác nhận mật khẩu không được để trống";
  } else if (formData.value.confirmPassword !== formData.value.password) {
    errors.value.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  return Object.keys(errors.value).length === 0;
};

// Handle form submission
const handleResetPassword = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const resetData = {
      username: formData.value.username,
      otpCode: formData.value.otp,
      newPassword: formData.value.password,
      confirmPassword: formData.value.confirmPassword,
    };

    await authService.resetPassword(resetData);

    successMessage.value =
      "Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...";

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.response) {
      errorMessage.value =
        error.response.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu";
    } else {
      errorMessage.value =
        "Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Handle send OTP
const handleSendOtp = async () => {
  if (!formData.value.username) {
    errors.value.username = "Vui lòng nhập tên đăng nhập trước khi gửi OTP";
    return;
  }

  isSendingOtp.value = true;
  errorMessage.value = "";

  try {
    // Call resetPassword API to send OTP (step 1: request OTP)
    await authService.confirmEmail({
      username: formData.value.username,
      email: "",
    });

    // Start countdown
    otpCountdown.value = 30;
    const countdownInterval = setInterval(() => {
      otpCountdown.value--;
      if (otpCountdown.value <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    successMessage.value = "Mã OTP đã được gửi đến email của bạn!";

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Send OTP error:", error);
    if (error.response) {
      errorMessage.value =
        error.response.data?.message || "Có lỗi xảy ra khi gửi OTP";
    } else {
      errorMessage.value = "Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại sau.";
    }
  } finally {
    isSendingOtp.value = false;
  }
};
</script>
