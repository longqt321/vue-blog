<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: "bg-white",
  },
  hoverColor: {
    type: String,
    default: "hover:bg-gray-100",
  },
});

const emit = defineEmits(["click"]);
const handleClick = () => {
  emit("click");
};
</script>

<template>
  <button
    @click="handleClick"
    class="flex items-center justify-center w-10 h-10 ml-2 rounded-full cursor-pointer"
    :class="[bgColor, hoverColor]"
  >
    <i :class="icon"></i>
  </button>
</template>
