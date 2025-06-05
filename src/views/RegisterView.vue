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
            <va-icon name="person_add" size="large" color="white" />
          </div>
        </div>
        <h2 class="text-2xl font-bold text-blue-800">Đăng Ký Tài Khoản</h2>
        <p class="text-gray-500 mt-2">Tạo tài khoản để bắt đầu chia sẻ blog</p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Full Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-blue-800 mb-1"
            >
              Họ <span class="text-red-500">*</span>
            </label>
            <va-input
              id="lastName"
              v-model="formData.lastName"
              placeholder="Nhập họ"
              class="w-full"
              color="primary"
              :error="!!errors.lastName"
              :error-messages="errors.lastName"
            />
          </div>
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-blue-800 mb-1"
            >
              Tên <span class="text-red-500">*</span>
            </label>
            <va-input
              id="firstName"
              v-model="formData.firstName"
              placeholder="Nhập tên"
              class="w-full"
              color="primary"
              :error="!!errors.firstName"
              :error-messages="errors.firstName"
            />
          </div>
        </div>

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
        <!-- Email Field -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-blue-800 mb-1"
          >
            Email <span class="text-red-500">*</span>
          </label>
          <va-input
            id="email"
            v-model="formData.email"
            placeholder="Nhập email"
            class="w-full"
            color="primary"
            :error="!!errors.email"
            :error-messages="errors.email"
            prepend-inner-icon="person"
          />
        </div>
        <!-- OTP Field -->
        <div>
          <label for="otp" class="block text-sm font-medium text-blue-800 mb-1">
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

        <!-- Confirm Password Field -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-blue-800 mb-1"
          >
            Xác nhận mật khẩu <span class="text-red-500">*</span>
          </label>
          <va-input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            class="w-full"
            color="primary"
            :error="!!errors.confirmPassword"
            :error-messages="errors.confirmPassword"
            prepend-inner-icon="lock"
          />
        </div>

        <!-- Terms Agreement -->
        <div class="flex items-start">
          <va-checkbox
            v-model="formData.agreeToTerms"
            label="Tôi đồng ý với các điều khoản và điều kiện"
            color="primary"
            :error="!!errors.agreeToTerms"
            :error-messages="errors.agreeToTerms"
          />
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

        <!-- Success Message Display -->
        <va-alert
          v-if="successMessage"
          color="success"
          icon="check_circle"
          bordered
          class="my-4"
        >
          {{ successMessage }}
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
            Đăng Ký
          </va-button>
        </div>

        <!-- Login Link -->
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản?
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
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/authService";

const router = useRouter();
const authStore = useAuthStore();

// Form data
const formData = ref({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});

// Validation
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);
const isSendingOtp = ref(false);
const otpCountdown = ref(0);
const errors = ref({});

const validateForm = () => {
  errors.value = {};
  if (!formData.value.firstName) {
    errors.value.firstName = "Tên không được để trống";
  }

  if (!formData.value.lastName) {
    errors.value.lastName = "Họ không được để trống";
  }

  if (!formData.value.username) {
    errors.value.username = "Tên đăng nhập không được để trống";
  } else if (formData.value.username.length < 3) {
    errors.value.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
  }
  if (!formData.value.email) {
    errors.value.email = "Email không được để trống";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      formData.value.email
    )
  ) {
    errors.value.email = "Email không hợp lệ";
  }

  if (!formData.value.password) {
    errors.value.password = "Mật khẩu không được để trống";
  } else if (formData.value.password.length < 6) {
    errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
  } else if (!formData.value.otp.length) {
    errors.value.otp = "Vui lòng nhập mã OTP";
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = "Xác nhận mật khẩu không được để trống";
  } else if (formData.value.confirmPassword !== formData.value.password) {
    errors.value.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  if (!formData.value.agreeToTerms) {
    errors.value.agreeToTerms =
      "Bạn phải đồng ý với các điều khoản và điều kiện";
  }

  return Object.keys(errors.value).length === 0;
};

const handleRegister = async () => {
  console.log("register");
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const userData = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      confirmPassword: formData.value.confirmPassword,
      otpCode: formData.value.otp,
    };
    console.log("userData", userData);
    await authService.register(userData);
    //router.push("/login");
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response) {
      errorMessage.value = error.response.data?.message;
    }
  } finally {
    isLoading.value = false;
  }
};

const handleSendOtp = async () => {
  if (!formData.value.email || !formData.value.username) {
    errors.value.otp =
      "Vui lòng nhập email và tên đăng nhập trước khi nhận mã OTP";
    return;
  }
  isSendingOtp.value = true;
  errors.value.otp = "";
  errorMessage.value = "";

  try {
    await authService.confirmEmail({
      username: formData.value.username,
      email: formData.value.email,
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
