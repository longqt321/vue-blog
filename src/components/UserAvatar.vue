<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Avatar",
  },
  size: {
    type: String, // md, lg, xl
    default: "lg",
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["changeAvatar"]);

const handleChangeAvatar = () => {
  emit("changeAvatar");
};

const sizeClasses = {
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "min-w-32 min-h-32",
};
</script>

<template>
  <div class="relative">
    <img
      :class="[sizeClasses[size], 'rounded-full border-2 border-white']"
      :src="src"
      :alt="alt"
    />
    <button
      v-if="editable"
      @click="handleChangeAvatar"
      class="absolute bottom-0 right-0 bg-gray-700 bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 transition"
    >
      <CameraIcon />
    </button>
  </div>
</template>
