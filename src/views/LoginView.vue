<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = () => {
  if (userStore.login(username.value, password.value)) {
    router.push("/");
  } else {
    errorMessage.value = "Invalid username or password";
  }
};
</script>

<template>
  <div class="bg-gray-400 w-full h-full flex justify-center items-center">
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-center mb-4">Login</h2>
      <form
        @submit.prevent="handleLogin"
        class="flex flex-col space-y-4 space-x-16"
      >
        <input
          type="text"
          placeholder="Username"
          class="p-2 border border-gray-300 rounded-lg w-full"
        />
        <input
          type="password"
          placeholder="Password"
          class="p-2 border border-gray-300 rounded-lg w-full"
        />
        <button
          type="submit"
          class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
      <h2 v-if="errorMessage" class="text-center text-red-500 bold">
        {{ errorMessage }}
      </h2>
    </div>
  </div>
</template>
