<template>
  <div class="avatar-container" :class="containerClass">
    <!-- Loading state -->
    <div v-if="loading" class="avatar-loading" :class="loadingClass">
      <va-progress-circle indeterminate :size="loadingSize" color="primary" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="avatar-error" :class="errorClass">
      <va-icon name="person" :size="errorIconSize" color="secondary" />
    </div>

    <!-- Success state -->
    <img
      v-else-if="imageUrl"
      :src="imageUrl"
      :alt="alt"
      :class="imageClass"
      @error="onImageError"
    />

    <!-- Placeholder state -->
    <div v-else class="avatar-placeholder" :class="placeholderClass">
      <va-icon name="person" :size="placeholderIconSize" color="secondary" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAvatarLoader } from "@/composables/useImageLoader";

const props = defineProps({
  // Avatar URL from backend
  avatarUrl: {
    type: String,
    default: "",
  },

  // Image alt text
  alt: {
    type: String,
    default: "Avatar",
  },

  // CSS classes
  containerClass: {
    type: String,
    default: "",
  },
  imageClass: {
    type: String,
    default: "w-full h-full object-cover",
  },
  loadingClass: {
    type: String,
    default: "flex items-center justify-center",
  },
  errorClass: {
    type: String,
    default: "flex items-center justify-center bg-gray-100",
  },
  placeholderClass: {
    type: String,
    default: "flex items-center justify-center bg-gray-100",
  },

  // Icon sizes
  loadingSize: {
    type: String,
    default: "24px",
  },
  errorIconSize: {
    type: String,
    default: "large",
  },
  placeholderIconSize: {
    type: String,
    default: "large",
  },
});

const emit = defineEmits(["error"]);

// Use the avatar loader composable
const { imageUrl, loading, error } = useAvatarLoader(
  computed(() => props.avatarUrl)
);

const onImageError = (event) => {
  emit("error", event);
};
</script>

<style scoped>
.avatar-container {
  position: relative;
  overflow: hidden;
}

.avatar-loading,
.avatar-error,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  min-height: 40px;
}

.avatar-error,
.avatar-placeholder {
  background-color: #f3f4f6;
}

/* Animation for loading state */
.avatar-loading {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
