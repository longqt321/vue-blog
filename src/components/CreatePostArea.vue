<script setup>
import { useModalStore } from "@/stores/modalStore";

const modalStore = useModalStore();
const openModal = () => {
  modalStore.openModalForCreate();
};
</script>

<template>
  <div class="relative">
    <textarea
      class="w-full p-4 h-28 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-blue-50/30 placeholder-blue-400"
      placeholder="Chia sẻ kiến thức, ý tưởng hoặc câu hỏi của bạn với cộng đồng..."
      @click="openModal"
      readonly
    ></textarea>
  </div>
</template>
