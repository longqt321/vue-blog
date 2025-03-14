<script setup>
import { ref, computed, watch } from "vue";
import { useBlogStore } from "@/stores/blogStore";
import RoundButton from "./RoundButton.vue";

const blogStore = useBlogStore();
const isOpen = computed(() => blogStore.isModalOpen);
const closeModal = () => {
  blogStore.closeModal();
};

watch(isOpen, (newVal) => {
  console.log("Watch: isOpen = ", newVal);
});

const textContent = ref("");
</script>
<template>
  <div
    v-if="isOpen"
    class="flex items-center justify-center flex-col fixed inset-0 z-50 bg-black/50"
  >
    <div class="mb-1 grid grid-cols-4 w-[90%] h-[5%]">
      <div class="col-span-1 flex items-center justify-start">
        <RoundButton icon="fa-solid fa-bars" />
        <RoundButton icon="fa-solid fa-image" />
        <RoundButton icon="fa-solid fa-link" />
        <RoundButton icon="fa-solid fa-user-tag" />
        <RoundButton icon="fa-solid fa-code" />
      </div>
      <div class="col-span-2 flex items-center justify-center">
        <button
          class="bg-white w-[50%] h-9 rounded-full hover:bg-blue-400 cursor-pointer"
        >
          Upload
        </button>
      </div>
      <div class="col-span-1 flex items-center justify-end">
        <RoundButton icon="fa-solid fa-minus" />
        <RoundButton icon="fa-solid fa-xmark" @click="closeModal" />
      </div>
    </div>
    <div class="flex bg-white w-[90%] h-[90%] border-2">
      <textarea
        v-model="textContent"
        class="w-[49.5%] h-full pl-1 bg-slate-300 resize-none focus:outline-none scrollbar-custom"
      ></textarea>
      <div class="w-[1%] h-full bg-gray-400"></div>
      <textarea
        v-model="textContent"
        class="w-[49.5%] h-full pl-1 bg-slate-300 resize-none focus:outline-none scrollbar-custom"
        readonly
      ></textarea>
    </div>
  </div>
</template>
